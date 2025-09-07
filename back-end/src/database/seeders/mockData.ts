import { Product, Store, ProductUrl, PriceHistory } from '../models';

async function seedMockData() {
  try {
    // Create stores
    const stores = await Store.bulkCreate([
      { name: 'Amazon' },
      { name: 'Ebay' },
    ]);

    const productData = [
      {
        name: 'PlayStation 5',
        targetPrice: 499.99,
        amazonUrl:
          'https://www.amazon.com.br/PlayStation-CFI-2014B01X-PlayStation%C2%AE5-Edi%C3%A7%C3%A3o-Digital/dp/B0CQKJN2C6/ref=sr_1_8?crid=3A70QTQ5NSGKD&dib=eyJ2IjoiMSJ9.Gv5s_ZDXMCA47TQIVc2Lh-jNgVXMxTgR9Nyjj9j5tG7HJ6cHSbgXY8Y8mFyZN4-Yi3YbOII9vOJxLeb55emRE0AHD_xPW3P85OHGrmmQKxqh_-MTMkSbSvPJ1Bx8nVbrZg08yVfwJb1GDcmmfPIFliEvHZ6zphBApg0FlEF64zAF0vkYF136_kPjERU6Uf2Ytta_8Wxq9BAnBRTSeyNKqATZv-VIqJ_PQFt3st2maf6mjwSsMZCdO7tCUtG1LbGRdTw_vlsSmH8Uosenopvv8w9Tfe2NWK3WMAvjjLWbsY4.n_vk0VN69E-vzcFdLYM6l5HJHEcp1z36hiIu6fCRxfY&dib_tag=se&keywords=playstation+5&qid=1757113106&sprefix=plastta%2Caps%2C206&sr=8-8&ufe=app_do%3Aamzn1.fos.25548f35-0de7-44b3-b28e-0f56f3f96147',
        ebayUrl:
          'https://www.ebay.com/itm/336163624495?_skw=Ps5&itmmeta=01K4E2XMCF4YBSRVWD9P3X5JFH&hash=item4e44e9d62f:g:Kk8AAeSwUGpomDI-&itmprp=enc%3AAQAKAAAA4FkggFvd1GGDu0w3yXCmi1cDUh%2BPHZx5cbJJRudos4i%2F8zP7e2v8rp0Su%2FM%2B2g%2Fh%2BqDtJv7%2BO8prYGsJwUW16osSP6lyxykEoDipmlSjYqBJbStG4D5UH%2FnpklBPJ9s4ZbuHDCt12QP89LBwDXhZL3qd4tOHeS9jKwiyfYovthDARVY4dTnaJTVkGgftrWxIeBIqSZikPDF7UOPSCsJW%2FBzvFlUMzO5qzdBXXd1kCuRRn6ZKZkYTr17V97ooqFJBifp4%2BNqpQxCXw0I2uXUfoq%2BYD%2BhIF08EFgQYjkkcivAi%7Ctkp%3ABFBM3Mb2wqNm&pfm=1',
      },
      {
        name: 'Xbox Series X',
        targetPrice: 499.99,
        amazonUrl:
          'https://www.amazon.com.br/Microsoft-Console-Xbox-Series-S/dp/B08JN2VMGX/ref=sr_1_1_sspa?crid=31ZQOMC4BMHKR&dib=eyJ2IjoiMSJ9.hfVuFTfuUl0KT9dbJfkFYxhkJTui87CeKBMXgSbm-2BChOgih2iMQiTVLwNOFttlzKeXCttHy_GnECm75o_bNAMrBtV13HIzhP6ZkJw6KzkU-5iM3Kya6MF0tGc9q85tIjmfBw9QCFehWIgodWm9MzGDXPMjSAZUQdCFayfTRvWWKEUu0fHKQHZo9EnnoAPLtF5HNn6Fn1YV7_S4aEkAwv_vpLc_I9mnF-HnJCA9guDeg3PMcgLwx92B4CZ3pBHWY8UHighIkOLvVtgfoXqxp1Nod9mMoN72d1fdoQMi3oY.yXz1Dup3TYdpk8nbwRz-Bf1gxPJlUCpnmoywPLssYsk&dib_tag=se&keywords=xbox+series+s&qid=1757113177&sprefix=xbox%2Caps%2C198&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.a492fd4a-f54d-4e8d-8c31-35e0a04ce61e&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1',
        ebayUrl:
          'https://www.ebay.com/itm/357506913806?_trkparms=amclksrc%3DITM%26aid%3D1110018%26algo%3DHOMESPLICE.COMPLISTINGS%26ao%3D1%26asc%3D20210609144404%26meid%3D8df2eaf2b1954170a9546265bd54a478%26pid%3D101196%26rk%3D4%26rkt%3D12%26sd%3D116394143310%26itm%3D357506913806%26pmt%3D1%26noa%3D0%26pg%3D2332490%26algv%3DCompVIDesktopATF2V6ReplaceKnnV4WithVectorDbNsOptHotPlRecall%26brand%3DMicrosoft&_trksid=p2332490.c101196.m2219&itmprp=cksum%3A3575069138068df2eaf2b1954170a9546265bd54a478%7Cenc%3AAQAKAAABMLgtLPsIDyOlK9%252Be8kjAsUURj4VBY1igy96vvNET9itpl3hF609JhQhCcnA33oSuVDFkWgW3PitgfhoQVULyYOUi6FLHMWJGL9VseJONo9A%252FHHnOxVT%252Btf8%252BIkhrxDFgJeY4LO5MO5JLmPhmgai1DZbmu%252FEOOVwH8I%252FQ1mxwbODEpBqSdgF8C2glCYLdBxXeReE%252BCdGaNt7UlQ34TBeGeMbsViri46xpsat7K3uQtvlAwnK7ozHg%252BuSeTdICaZX%252Fvyvx2O5%252FHEyanctoPK8TlsDLArUVVJAdkoUcQqSMcd%252F7k7rRTHO9UyCNBhXpcJkwzK6HUEXwdN9X%252BEePF2o2HytfsedNuB98zTYRhpLftePXpqXJmZx%252FCtGJty%252FtDk66C18tw%252FBh9Roq%252BK4FNe0McoY%253D%7Campid%3APL_CLK%7Cclp%3A2332490&epid=17040992349&itmmeta=01K4E336R2DFAS4XPZS44F1N8Y',
      },
      {
        name: 'Nintendo Switch OLED',
        targetPrice: 349.99,
        amazonUrl:
          'https://www.amazon.com.br/Nintendo-Switch-Transporte-Prote%C3%A7%C3%A3o-FLENSBOX/dp/B0FL1KF3QR/ref=sr_1_1_sspa?crid=3ILC7GLRG5AFU&dib=eyJ2IjoiMSJ9.YZYMXXbh2kG4Tx_d677_IngJi_QmBsDGWzBjEstvAqLJYmJ2e6eYo2vTsvlIuz8eiyiEB-CL63fwUIvPVoTWUhpWGsyXSoqgpFXfNwsZczADcTIepXr596bSFcMlIPItdAPBT4a4V2gynZCvjwwgh3CiEczMTBy6CkOnJJLVeKiQVdtuH3dlCi8W5G3uyH6V-aNBuUpvsgCKJ-pyFSv6M2Pe2pYJM29Cyr4nKa7xwxtL_rcq0HOvlGQoBbDjUwSk_fhrz0qVqhwvR8-Ty6fVj4qIgdPT5zjx8N6OgAas5uQ.lNc8DMSXb-iy8PaRjtrKityOsqq5kWuC9kk3OTwYooE&dib_tag=se&keywords=nintendo+switch+2&qid=1757113194&sprefix=ninten%2Caps%2C221&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.6a09f7ec-d911-4889-ad70-de8dd83c8a74&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1',
        ebayUrl:
          'https://www.ebay.com/itm/177230552844?_skw=nintendo+switch&itmmeta=01K4E2YM01W70B656W6665616Z&hash=item2943c39f0c:g:fBgAAeSwK0ZoYPQ6&itmprp=enc%3AAQAKAAAA8FkggFvd1GGDu0w3yXCmi1ebg1XdBKlVYsDJige6cP%2Btccmwqw%2FcwC0vZXKHUcu6jeVDBEXpfMUsOW34Rr4Q%2FYu2Y9P83evTCu6ec2ISNQra8l0DWvkYev9DtbvR2w0MZ5lJgTWDtxMbDaqw8UxK23Pt%2FbuxaX3mKN9oKPoFAVT3lalaIjJcYDP6Ftbkh3i0xKmaUJzfOGPGaST6%2FK4YP7fNRHt95%2F3cP%2Fxd%2FCPHdujEQPOsEXVWINirtVNUgI4BXaET6OE9q9axsyfK9IGMiNan6uCIhY5QTR4bjmKCO72LiEd7dNgBN5dHJQ6y%2FrwuCg%3D%3D%7Ctkp%3ABFBMosD6wqNm&pfm=1',
      },
      {
        name: 'AirPods Pro',
        targetPrice: 249.99,
        amazonUrl:
          'https://www.amazon.com.br/Apple-MXP63BZ-A-AirPods-4/dp/B0DGM4T4H8/ref=sr_1_1_sspa?crid=38FD6URPN0D&dib=eyJ2IjoiMSJ9._6VxMpafiuiRlRxh-FZgEpvJoyWLBiUkcbBL1Sx5zf8NcBpjL69I1hLADSvTyMP1Pvv3YRgrIldQPHdZw-eaSfkFQ-1e2CfQwwCPHHsUWVDCz4SVS_C6_faHtkO_z7SEtq_597Vlibndyv5AJSWLtibyntj0V-DgMUqlQcGOvxJp3psemMJ1bedTUyzJ9Kag_y4IkFD9uSbnn_bKEv8IvoTHXwemexu4TV1l1md7PMAln0Q6tHxWdFHI2zqDuOo03cwscYW2uvybQbyUpoqhI5AKdQDz1DFd04WYpGtCT1Y.nkObxFaquTG2fmZZXNR_7AU7ExDQEf3SicHe5O3qdL8&dib_tag=se&keywords=airpods%2Bpro&qid=1757113213&sprefix=airpods%2Caps%2C201&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.25548f35-0de7-44b3-b28e-0f56f3f96147&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1',
        ebayUrl:
          'https://www.ebay.com/itm/365691606859?_skw=airpods+pro&epid=10034976643&itmmeta=01K4E2ZB591SN2CRSGSFG1ZGY3&hash=item5524eb174b:g:dmoAAOSwznxoWyV4&itmprp=enc%3AAQAKAAAA4FkggFvd1GGDu0w3yXCmi1dAzDJwrPE4vC5E%2BR452Q25TQ1o55knK6vM4u5G6lKHqeznoJPjR6Gi%2FRj%2FfH3qTrOBlUbuwLsdiOam377FxKbzGZEp9%2BLl48m8krLgXa0Xc%2BBAb4BkR927C3k%2B5EuGAoBzweZVnrHcMZG9EVp3490tqiXakDJ4trO3qfbEDAjjGNnwjCVeuHX6axizESrQw%2FGZ5kHvjYhYSGIwybNSRba8HR3r%2BYEjhSRUlA2x5XPd19K90C71XaJ7STVKRfYwCcSQNFZ4%2FeM5n4LA10sO90vu%7Ctkp%3ABFBM6LL9wqNm&pfm=1',
      },
    ];

    // Create products
    const products = await Product.bulkCreate(
      productData.map((p) => ({ name: p.name, targetPrice: p.targetPrice }))
    );

    // Create product URLs using the actual URLs from productData
    const productUrls = [];
    for (const [index, product] of products.entries()) {
      const urls = {
        Amazon: productData[index].amazonUrl,
        Ebay: productData[index].ebayUrl,
      };

      for (const store of stores) {
        productUrls.push({
          productId: product.id!,
          storeId: store.id!,
          url: urls[store.name as keyof typeof urls],
        });
      }
    }
    await ProductUrl.bulkCreate(productUrls);

    // Create price history (last 7 days)
    /*const priceHistories = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      for (const product of products) {
        for (const store of stores) {
          // Random price variation around target price
          const variation = Math.random() * 50 - 25; // +/- $25
          const price = Number((product.targetPrice + variation).toFixed(2));

          priceHistories.push({
            productId: product.id!,
            storeId: store.id!,
            price: price,
            date: date,
          });
        }
      }
    }
    await PriceHistory.bulkCreate(priceHistories);*/

    console.log('Mock data seeded successfully!');
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
}

// Execute the seeding
seedMockData();
