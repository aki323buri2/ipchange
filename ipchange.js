const iconv = require('iconv-lite');
const cs = require('child_process');
const ip = require('ip');
const spawn = async (command, ...args) => {
    return await new Promise((resolve, reject) => {
        const spawn = cs.spawn(command, args);
        spawn.on('close', code => resolve(code));
        spawn.on('error', err => reject(err));
        spawn.stdout.on('data', data => console.log(iconv.decode(data, 'Shift_JIS')));
    });
};
const adaptor = 'イーサネット';
const netsh = (...args) => spawn('netsh', 'interface', 'ip', ...args);
const netshSet = (what, ...args) => netsh('set', what, adaptor, ...args);
const dhcp = async () => {
    await netshSet('address', 'dhcp');
    await netshSet('dns', 'dhcp');
};
const manual = async (address, mask, gateway, dns) => {
    await netshSet('address', 'static', address, ip.fromPrefixLen(mask), gateway);
    await netshSet('dns', 'static', dns || gateway, 'validate=no');
}
(async () => {
    try {
        let code;
        // code = await manual('192.168.0.50', 24, '192.168.0.1');
        code = await dhcp();
        console.log(code);
    }
    catch (err)
    {
        console.log(err);
    }
})();