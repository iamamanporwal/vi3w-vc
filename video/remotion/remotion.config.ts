import {Config} from '@remotion/cli/config';

// Cloud container: use the pre-installed headless shell instead of downloading one,
// and software GL so three.js scenes render without a GPU.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ??
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
Config.setChromiumOpenGlRenderer('swangle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setConcurrency(4);
Config.setDelayRenderTimeoutInMilliseconds(180000);
