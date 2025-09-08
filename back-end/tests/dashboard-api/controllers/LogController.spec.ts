import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { LogController } from '../../../src/dashboard-api/controllers/LogController';
import { Logger } from '../../../src/utils/Logger';
import { ApplicationLogs } from '../../../src/database/models';

jest.mock('../../../src/database/models', () => ({
  ApplicationLogs: {
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockRequest = (query = {}, params = {}, body = {}) =>
  ({
    query,
    params,
    body,
    method: 'TEST',
    path: '/test',
  } as unknown as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('LogController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  describe('getLogs', () => {
    it('should return all logs successfully when no filters are provided', async () => {
      req = mockRequest();
      const mockLogs = [
        {
          id: 1,
          message: 'Log message 1',
          severity: 'info',
          timestamp: new Date(),
          route: '/api/test',
          method: 'GET',
          statusCode: 200,
        },
      ];
      (ApplicationLogs.findAll as jest.Mock).mockResolvedValue(mockLogs);

      await LogController.getLogs(req, res);

      expect(ApplicationLogs.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['timestamp', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith(
        mockLogs.map((log) => ({
          ...log,
          timestamp: expect.any(Date),
        }))
      );
    });

    it('should filter logs by date range', async () => {
      const startDate = '2025-09-01T00:00:00.000Z';
      const endDate = '2025-09-07T23:59:59.000Z';
      req = mockRequest({ startDate, endDate });
      (ApplicationLogs.findAll as jest.Mock).mockResolvedValue([]);

      await LogController.getLogs(req, res);

      expect(ApplicationLogs.findAll).toHaveBeenCalledWith({
        where: {
          timestamp: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
        },
        order: [['timestamp', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should filter logs by severity', async () => {
      req = mockRequest({ severity: 'error' });
      (ApplicationLogs.findAll as jest.Mock).mockResolvedValue([]);

      await LogController.getLogs(req, res);

      expect(ApplicationLogs.findAll).toHaveBeenCalledWith({
        where: { severity: 'error' },
        order: [['timestamp', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should filter logs by productId (route)', async () => {
      req = mockRequest({ productId: '123' });
      (ApplicationLogs.findAll as jest.Mock).mockResolvedValue([]);

      await LogController.getLogs(req, res);

      expect(ApplicationLogs.findAll).toHaveBeenCalledWith({
        where: {
          route: { [Op.like]: '%123%' },
        },
        order: [['timestamp', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle internal server errors gracefully', async () => {
      req = mockRequest();
      const error = new Error('Database connection failed');
      (ApplicationLogs.findAll as jest.Mock).mockRejectedValue(error);

      await LogController.getLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
      expect(Logger.error).toHaveBeenCalledWith(
        'Error retrieving logs',
        expect.any(String),
        500,
        'TEST',
        '/test'
      );
    });
  });

  describe('deleteAllLogs', () => {
    it('should delete all logs and return 204 No Content', async () => {
      req = mockRequest();
      (ApplicationLogs.destroy as jest.Mock).mockResolvedValue(5);

      await LogController.deleteAllLogs(req, res);

      expect(ApplicationLogs.destroy).toHaveBeenCalledWith({ where: {} });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle internal server errors gracefully on deletion', async () => {
      req = mockRequest();
      const error = new Error('Deletion failed');
      (ApplicationLogs.destroy as jest.Mock).mockRejectedValue(error);

      await LogController.deleteAllLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
      expect(Logger.error).toHaveBeenCalledWith(
        'Error deleting logs',
        expect.any(String),
        500,
        'TEST',
        '/test'
      );
    });
  });
});
