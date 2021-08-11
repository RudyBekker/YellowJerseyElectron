const electronInstaller = require('electron-winstaller');


try {
    electronInstaller.createWindowsInstaller({
      appDirectory: '/public',
      outputDirectory: '/out/build/installer64',
      authors: 'Yellow',
      exe: 'Yellow.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }