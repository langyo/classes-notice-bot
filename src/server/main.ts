import { createClient } from 'oicq';
import { readFileSync } from 'fs';
import { join } from 'path';

const { qq, key } = JSON.parse(
  readFileSync(join(process.cwd(), './dist/config.json'), 'utf8')
).accounts[0];
const client = createClient(qq);

//监听上线事件
client.on('system.online', () => console.log('Logged in!'));

//监听消息并回复
client.on('message', (event) => event.reply('hello world'));

client
  .on('system.login.slider', function (event) {
    //监听滑动验证码事件
    process.stdin.once('data', (input) => {
      const ticket = input.toString('utf8').trim();
      console.log('接收到的 ticket:');
      console.log(ticket);
      this.sliderLogin(ticket); //输入ticket
    });
  })
  .on('system.login.device', function (event) {
    //监听登录保护验证事件
    process.stdin.once('data', () => {
      this.login(); //验证完成后按回车登录
    });
  })
  .login(key); //需要填写密码或md5后的密码
