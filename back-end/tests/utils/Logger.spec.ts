import { Logger } from '../../src/utils/Logger';
import { ApplicationLogs } from '../../src/database/models/ApplicationLogs';

jest.mock('../../src/database/models/ApplicationLogs', () => ({
  ApplicationLogs: {
    create: jest.fn(),
  },
}));

describe('Logger utility class', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should call ApplicationLogs.create with severity "info" and message', () => {
      const message = 'Info message';
      Logger.info(message);
      expect(ApplicationLogs.create).toHaveBeenCalledTimes(1);
      const callArg = (ApplicationLogs.create as jest.Mock).mock.calls[0][0];
      expect(callArg.message).toBe(message);
      expect(callArg.severity).toBe('info');
      expect(callArg.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('warning', () => {
    it('should call ApplicationLogs.create with severity "warning" and message', () => {
      const message = 'Warning message';
      Logger.warning(message);
      expect(ApplicationLogs.create).toHaveBeenCalledTimes(1);
      const callArg = (ApplicationLogs.create as jest.Mock).mock.calls[0][0];
      expect(callArg.message).toBe(message);
      expect(callArg.severity).toBe('warning');
      expect(callArg.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('error', () => {
    it('should call ApplicationLogs.create with severity "error" and all optional parameters', () => {
      const message = 'Error message';
      const stack = 'Error stack trace';
      const statusCode = 500;
      const method = 'GET';
      const route = '/test-route';

      Logger.error(message, stack, statusCode, method, route);
      expect(ApplicationLogs.create).toHaveBeenCalledTimes(1);
      const callArg = (ApplicationLogs.create as jest.Mock).mock.calls[0][0];
      expect(callArg.message).toBe(message);
      expect(callArg.severity).toBe('error');
      expect(callArg.stack).toBe(stack);
      expect(callArg.statusCode).toBe(statusCode);
      expect(callArg.method).toBe(method);
      expect(callArg.route).toBe(route);
      expect(callArg.timestamp).toBeInstanceOf(Date);
    });

    it('should call ApplicationLogs.create with severity "error" and only message if optional params are missing', () => {
      const message = 'Error message only';

      Logger.error(message);
      expect(ApplicationLogs.create).toHaveBeenCalledTimes(1);
      const callArg = (ApplicationLogs.create as jest.Mock).mock.calls[0][0];
      expect(callArg.message).toBe(message);
      expect(callArg.severity).toBe('error');
      expect(callArg.stack).toBeUndefined();
      expect(callArg.statusCode).toBeUndefined();
      expect(callArg.method).toBeUndefined();
      expect(callArg.route).toBeUndefined();
      expect(callArg.timestamp).toBeInstanceOf(Date);
    });
  });
});
