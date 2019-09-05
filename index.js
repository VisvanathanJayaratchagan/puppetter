const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));

  let url = "http://inet/LeaveTracks/Login.aspx";
  console.log(`Fetching page data for : ${url}...`);
  await page.goto(url);
  //  await page.goto('http://inet/LeaveTracks/login.aspx');
  await page.type('#txtUsername', 'username')
  await page.type('#txtPassword', '********');
  await page.click('#btnLogin');
  await page.waitForSelector('#Signout1_LinkButton3');
  debugger;
  await page.click('#Signout1_LinkButton3');

  const popup = await newPagePromise;
  console.log(popup.url());

  await popup.waitForSelector('.titlemlop');
  const text = await popup.evaluate(() => Array.from(document.querySelectorAll('.titlemlop'), element => element.lastElementChild.textContent));
  const time = await popup.evaluate(() => Array.from(document.querySelectorAll('.titlemlop'), element => element.querySelectorAll('td')[1].textContent));
  const DateVal = await popup.evaluate(() => Array.from(document.querySelectorAll('.titlemlop'), element => element.querySelectorAll('td')[0].textContent));

  var from = "-Aug-19 9:30:00";
  var to = "-Aug-19 ";
  // let content = await popup.evaluate(() => {
  //     let divs = [...document.querySelectorAll('.titlemlop')];
  //     return divs.map((div) => div.textContent.trim());
  //   });
  //console.log(content())
  var reg = /[(](.*)[)]/i;
  //         /\(([^)]+)\)/i
  console.log(text.length);
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time)
    });
  }
  for (var i = 0; i < text.length; i++) {
    break
    // console.log(text[i]);
    if (text[i].match(reg)[1] == "FS") {
      console.log(time[i] + "  :" + text[i].match(reg)[1]);

      await page.waitForSelector('#EmpSideMenu1_lnkPerApplication');
      await page.click('#EmpSideMenu1_lnkPerApplication');
      await page.waitForNavigation();
      await page.waitForSelector('#cmbCategory');

      await page.select('#cmbCategory', 'OD')
      await page.type('#txtReason', 'Compensated on the same day.');
      console.log(DateVal[i] + from);
      console.log(DateVal[i] + to + time[i]);
      var a = DateVal[i] + from;
      var b = DateVal[i] + to + time[i]
      await page.$eval('input[name=TxtFromTime]', (el, value) => el.value = value, a);
      await page.$eval('input[name=TxtToTime]', (el, value) => el.value = value, b);
      await delay(500);
      await page.click('#cmdSubmit');
      await delay(500);
      console.log('alert')
     // await page.keyboard.press('Enter');
     await page.keyboard.press("Enter", {delay: 1000});
     console.log('Enter')
      //await page.keyboard.press(String.fromCharCode(13));
      await delay(2000);
     // await page.waitForNavigation();
      await page.waitForSelector('#txtempcode');
      //break;
      // await page.type('#TxtFromTime', DateVal[i]+from);
      // await page.type('#TxtToTime', DateVal[i]+to+time[i]);

      //    var fill=await page.evaluate(() =>{

      //         document.querySelector('#cmbCategory').value="OD"
      //         document.querySelector('#TxtFromTime').value=DateVal[i]+from;
      //         document.querySelector('#TxtFromTime').value=DateVal[i]+from+time[i];


      //     })
      //     fill();
     // break;
    }
   

  }
  console.log('finished')
  //await page.screenshot({ path: 'example.png' });

})();