// Name: Image Blocks: Potentia Edition
// ID: potBlocksByGaia
// Description: PotentiaMod's modification of the Image Blocks extension. Only works best in PenguinMod.
// By: GaiaWindWave90 <https://scratch.mit.edu/users/kinetaV/>
// License: MPL-2.0
/**
 * Based on Image Blocks BY Ashimee, 0znzw, and CST1229
 *
 */
(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
      throw new Error('Image Blocks: Potentia Edition must run unsandboxed');
    }
    var runtime = vm.runtime;
    const isPM = Scratch.extensions.isPenguinMod;
    const mehPath = 'POTImageBlocks';
    
    function injectPotentia(cat) {
      document
        .querySelector('g.blocklyWorkspace')
        .querySelectorAll(`g[data-category="${cat}"]`)
        .forEach((g) => {
          let block = vm.runtime.getEditingTarget().blocks.getBlock(g.dataset.id);
          if (block) {
            if (
              !g.querySelector('svg#dango') &&
              block.opcode === 'potBlocksByGaia_db'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="87.99945" height="88.00142" viewBox="0,0,87.99945,88.00142" id="dango">
    <!-- This icon is based on Twemoji https://twemoji.twitter.com/ -->
    <!-- License: CC-BY 4.0 https://creativecommons.org/licenses/by/4.0/ -->
    <g transform="translate(-196.00028,-135.99929)">
      <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
        <path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-80.84584,-80.84848c-1.26384,-1.26384 -1.26384,-3.31657 0,-4.58041c1.26384,-1.26384 3.31657,-1.26384 4.58041,0l80.84584,80.84584c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.6306 -1.46173,0.94985 -2.29021,0.94985z" fill="#d99e82"/>
        <path d="M231.6304,153.81435c0,9.83892 -7.97614,17.81506 -17.81506,17.81506c-9.83892,0 -17.81506,-7.97614 -17.81506,-17.81506c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81506,7.97614 17.81506,17.81506z" fill="#fcb1e3"/>
        <path d="M229.16098,190.59288c-9.57565,-2.26111 -15.50524,-11.85671 -13.24412,-21.43235c2.26111,-9.57565 11.85671,-15.50524 21.43235,-13.24412c9.57565,2.26111 15.50524,11.85671 13.24412,21.43235c-2.26111,9.57565 -11.85671,15.50524 -21.43235,13.24412z" fill="#ffd983"/>
        <path d="M270.50321,192.68453c0,9.83892 -7.97878,17.81769 -17.81769,17.81769c-9.83892,0 -17.81506,-7.97878 -17.81506,-17.81769c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81769,7.97878 17.81769,17.81506z" fill="#a6d388"/>
        <path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-19.84141,-19.84141c-1.26648,-1.26384 -1.26648,-3.31657 0,-4.58041c1.26648,-1.26384 3.31393,-1.26384 4.58041,0l19.84141,19.84141c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.62796 -1.46173,0.94721 -2.29021,0.94721z" fill="#d99e82"/>
      </g>
    </g>
  </svg><!--rotationCenter:44:44-->`;
            if (
              !g.querySelector('svg#potentia') &&
              block.opcode === 'potBlocksByGaia_pb'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="131.28302" height="118.88105" viewBox="0,0,131.28302,118.88105"><title>Slice 1</title><defs><linearGradient x1="321.5504" y1="138.40935" x2="314.80863" y2="192.24184" gradientUnits="userSpaceOnUse" id="color-1"><stop offset="0" stop-color="#6426ff" stop-opacity="0"/><stop offset="1" stop-color="#6426ff"/></linearGradient><linearGradient x1="301.52937" y1="144.37467" x2="307.1798" y2="198.3326" gradientUnits="userSpaceOnUse" id="color-2"><stop offset="0" stop-color="#6426ff" stop-opacity="0"/><stop offset="1" stop-color="#6426ff"/></linearGradient><linearGradient x1="367.13973" y1="150.14464" x2="367.13973" y2="160.18898" gradientUnits="userSpaceOnUse" id="color-3"><stop offset="0" stop-color="#4800fc"/><stop offset="1" stop-color="#1a005d"/></linearGradient></defs><g transform="translate(-254.38186,-120.5182)"><g stroke-miterlimit="10"><path d="M303.8721,136.19547c30.28196,3.71532 42.77367,58.17868 42.77367,58.17868c-3.97232,2.84453 -9.49932,0.21339 -14.82864,-1.76304c-1.2874,-0.47743 1.32402,-4.38789 0.75137,-4.91607c-1.87131,-1.72632 -18.96029,-8.00053 -19.27448,-10.30962c-0.22309,-1.63918 3.2165,-4.24632 2.73149,-5.66148c-0.67674,-1.97454 -17.35253,-7.96115 -17.65415,-11.17067c-0.21128,-2.24767 5.84531,-6.47487 5.58799,-7.3877c-0.64262,-2.27936 -14.63003,-13.82265 -14.63003,-13.82265c0,0 9.54666,-3.76039 14.54278,-3.14739z" fill="url(#color-1)" stroke="#3d00d6" stroke-width="1" stroke-linecap="round"/><path d="M261.08256,157.11731c2.79264,9.363 13.92989,25.61444 28.63006,31.33799c15.30173,5.95774 34.14341,1.31351 34.79399,7.45204c1.33978,12.64189 -21.15554,10.62256 -29.82327,8.65214c-22.09084,-5.02201 -42.21657,-23.67028 -39.56583,-48.21028c0.13394,-1.23996 0.77374,-9.6397 2.07972,-9.93542c0.423,-0.09576 3.59037,9.71455 3.88533,10.70353z" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M327.87173,209.15372c1.35824,4.72699 0.38254,11.21427 0.11423,16.33084c-0.20917,3.98916 2.2285,6.84273 2.04441,10.36974c-0.14363,2.75175 -2.57204,2.68762 -3.99544,2.61943c-2.73545,-0.13102 -5.81882,0.31262 -7.8928,-2.50808c-3.06409,-4.16735 -0.2649,-33.01903 3.02846,-35.70189" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M351.81493,198.3898c3.27565,3.77685 4.55725,21.48191 5.61561,27.88903c0.34896,2.11254 1.63901,3.63972 1.65586,6.3587c0.00417,0.67311 0.03022,1.53432 -0.14244,2.1218c-0.7055,2.40057 -4.03227,2.25249 -5.18747,2.25249c-1.02402,0 -3.70054,0.23511 -4.53635,-1.22078c-1.62352,-2.82806 -2.27102,-24.98596 -3.83377,-30.85195" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M326.34169,187.08416c5.84428,-0.55054 15.28613,-0.39462 18.14339,-6.65636c3.78102,-8.28639 1.41956,-23.70072 1.41956,-23.70072l11.61771,3.14311c0,0 5.50935,26.78025 -0.72397,41.82558c-6.23326,15.04533 -21.83585,14.39226 -31.57321,13.77039c-19.42424,-1.2405 -26.15881,-25.8124 1.11653,-28.38195z" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M344.33575,205.91182c7.59313,-4.08627 15.47055,-18.73986 15.47055,-18.73986c0,0 -0.06234,16.88285 -9.15729,23.45629c-14.6082,10.55822 -34.27611,3.0902 -34.27611,3.0902c0,0 17.60373,-2.2318 27.96285,-7.80663z" fill="#6426ff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M344.30964,199.67834c3.27565,3.7768 4.55725,21.48186 5.61561,27.88898c0.34896,2.11254 1.63901,3.63972 1.65586,6.3587c0.00417,0.67311 0.03017,1.53432 -0.14244,2.1218c-0.7055,2.40057 -4.03227,2.25249 -5.18747,2.25249c-1.02402,0 -3.70059,0.23511 -4.53635,-1.22078c-1.62352,-2.82806 -2.27107,-24.98596 -3.83377,-30.85195" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M318.42061,209.5583c1.35824,4.72699 0.38254,11.21427 0.11428,16.33084c-0.20922,3.98916 2.22845,6.84273 2.04435,10.36974c-0.14363,2.75175 -2.57204,2.68762 -3.99544,2.61943c-2.73539,-0.13102 -5.81882,0.31262 -7.8928,-2.50808c-3.06409,-4.1673 -0.2649,-33.01903 3.02846,-35.70189" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M283.80985,146.23033c30.33509,-3.2536 54.86036,46.95407 54.86036,46.95407c-3.22316,3.67172 -9.20306,2.36347 -14.84185,1.64806c-1.36209,-0.17283 0.29371,-4.57388 -0.38378,-4.95837c-2.21431,-1.25659 -20.28122,-3.48909 -21.11129,-5.66663c-0.58922,-1.5458 2.16903,-4.86548 1.37547,-6.13366c-1.10716,-1.76943 -18.70644,-3.81558 -19.72857,-6.8729c-0.71579,-2.14109 4.22346,-7.63245 3.76569,-8.46306c-1.14312,-2.07403 -17.38513,-10.14199 -17.38513,-10.14199c0,0 8.44421,-5.82873 13.44911,-6.36552z" fill="url(#color-2)" stroke="#3d00d6" stroke-width="1" stroke-linecap="round"/><path d="M365.1204,144.86266c-1.8848,-2.66439 -5.26562,-10.62039 -3.27722,-13.69862c1.71034,-2.64781 3.8224,2.21187 4.37841,1.80789c0.1263,-0.09175 -0.08005,-0.30471 -0.08373,-0.46075c-0.07528,-3.17994 -0.21708,-7.16282 1.1142,-10.1057c0.07864,-0.1738 0.3749,-0.999 0.56046,-0.95388c4.91997,1.19528 12.72167,23.4486 8.02046,27.16095" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M372.21444,148.06519c-5.82516,-8.3145 1.74349,-12.49523 -0.34089,-16.43456c-1.19517,-2.25878 -5.01166,-5.66121 -5.01166,-5.66121l-1.43954,2.39066l-3.13407,-7.25934l8.0386,0.80797l-2.28071,2.11953c0,0 5.83334,2.73046 6.9106,6.94358c1.11279,4.3522 -2.66959,6.08399 -2.63752,9.87617c0.01863,2.2011 1.28404,5.16797 2.16784,7.16011" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M376.5688,154.60852c0,8.1095 2.89056,14.65288 -15.28337,13.93536c-8.9426,-0.35307 -15.61592,-5.82586 -15.61592,-13.93536c0,-8.10955 6.91704,-14.68359 15.44964,-14.68359c8.5326,0 15.44964,6.57404 15.44964,14.68359z" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M350.53516,143.94274c0,0 9.88029,-9.31079 21.94542,0.10388c10.08854,7.87222 12.63756,20.51287 12.63756,20.51287c0,0 -4.11703,3.68147 -12.38685,3.16586c-4.47238,-0.18491 -5.65282,-3.66463 -5.65282,-3.66463" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M352.08205,146.83195c-3.11246,-0.98172 -10.61693,-5.27261 -10.89531,-8.92657c-0.23944,-3.14306 4.38188,-0.5506 4.58027,-1.2086c0.04506,-0.14943 -0.24806,-0.19417 -0.34538,-0.31625c-1.98331,-2.48679 -4.50521,-5.57282 -5.22506,-8.72157c-0.04246,-0.18593 -0.30563,-1.02229 -0.13064,-1.0986c4.64099,-2.02394 24.31355,10.97867 22.81514,16.77843" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M352.13366,158.93646l-16.43678,3.95937l5.5973,-5.62563l-9.6065,-6.30139l10.99725,-0.49714l-8.4187,-12.69129l18.5412,13.23707" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M369.48071,152.01354c1.52294,1.15935 5.7397,2.26963 5.7397,2.26963c0,0 -4.53996,1.43345 -5.92511,2.33179c-1.50702,0.97738 -4.16959,7.66606 -4.16959,7.66606c0,0 -1.40363,-6.6099 -2.88419,-7.58374c-1.56367,-1.0285 -5.0282,-3.2893 -5.0282,-3.2893c0,0 3.40394,-0.64306 4.96197,-1.79134c1.35536,-0.99892 3.62508,-8.0322 3.62508,-8.0322c0,0 2.19468,7.29812 3.68034,8.42909z" fill="#6426ff" stroke="#000000" stroke-width="0" stroke-linecap="round"/><path d="M367.82075,147.296c-11.59735,-5.00045 -5.28799,-12.88015 -8.86412,-15.53988c-2.05053,-1.52511 -6.95939,-2.95512 -6.95939,-2.95512l-0.27124,2.77742l-5.95184,-5.2055l7.6045,-2.72819l-1.14723,2.89441c0,0 6.44064,-0.04409 9.22527,3.29601c2.87659,3.45037 0.20689,6.64071 1.86698,10.05041c0.96358,1.97904 3.38213,4.11313 5.03679,5.53144" fill="#1a0a41" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M378.03288,147.23929c-0.94944,2.27053 -3.51482,3.36025 -5.73,2.43399c-2.21512,-0.92631 -3.2412,-3.5178 -2.29176,-5.78833c0.94944,-2.27053 10.21576,-14.85187 10.21576,-14.85187c0,0 -1.24456,15.93568 -2.194,18.20621z" fill="#6426ff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M364.42042,149.81101l-2.11931,-2.41362" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M360.77053,148.57479l2.29593,2.17813" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M361.64826,161.17287c-0.4706,-1.33003 -0.64186,-2.83099 -0.64186,-4.51333c0,-4.79377 2.1068,-8.74946 4.82985,-8.74946c2.72299,0 4.6789,3.7469 4.6789,8.54067c0,1.77978 -0.05275,3.57369 -0.5747,4.95079" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M370.20399,155.16681c0,2.77368 -1.37195,5.02217 -3.06426,5.02217c-1.69236,0 -3.06426,-2.24849 -3.06426,-5.02217c0,-2.77368 1.37189,-5.02217 3.06426,-5.02217c1.69231,0 3.06426,2.24854 3.06426,5.02217z" fill="url(#color-3)" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M368.8718,155.12548c0,1.75919 -0.67609,2.98927 -1.54379,2.98927c-0.8677,0 -1.59844,-1.23009 -1.59844,-2.98927c0,-1.75919 0.70341,-2.98927 1.57111,-2.98927c0.8677,0 1.57111,1.23009 1.57111,2.98927z" fill="#000000" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M369.02077,152.74657c0,1.02849 -0.67882,1.86224 -1.51619,1.86224c-0.83737,0 -1.51619,-0.83375 -1.51619,-1.86224c0,-1.02849 0.67882,-1.86224 1.51619,-1.86224c0.83737,0 1.51619,0.83375 1.51619,1.86224z" fill="#ffffff" stroke="#000000" stroke-width="0" stroke-linecap="butt"/><path d="M366.25762,156.52324c0,0.4037 -0.26646,0.73097 -0.59514,0.73097c-0.32869,0 -0.59514,-0.32727 -0.59514,-0.73097c0,-0.4037 0.26646,-0.73097 0.59514,-0.73097c0.32869,0 0.59514,0.32727 0.59514,0.73097z" fill="#ffffff" stroke="#000000" stroke-width="0" stroke-linecap="butt"/></g></g></svg><!--rotationCenter:65.61814155236519:59.48179504645077-->`;
  
            if (
              !g.querySelector('svg#wenda') &&
              block.opcode === 'potBlocksByGaia_wenda'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="66.22254" height="104.85056" viewBox="0,0,66.22254,104.85056"><g transform="translate(-286.88873,-127.57472)"><g stroke-linejoin="round" stroke-miterlimit="10"><path d="M296.50017,168.23458l-4.26174,-40.15986l23.02887,20.08596" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M324.23555,148.16068l23.02887,-20.08596l-4.26174,40.15986" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M306.18167,186.67491l-12.52862,-0.73698l5.89582,-7.49261l-12.16014,-2.4566l9.45789,-4.42187" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M305.93601,186.36784l-11.56096,-0.68005l5.76288,-7.51271l-11.42053,-2.34363l1.66469,-0.87142l9.7441,3.22494l-4.60132,6.00897z" fill="#e6e6e6" stroke="none" stroke-width="1" stroke-linecap="round"/><path d="M343.15338,171.56686l9.45789,4.42187l-12.16014,2.4566l5.89582,7.49261l-12.52862,0.73698" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M344.51408,184.19395l-4.60131,-6.00897l9.74409,-3.22494l1.66469,0.87142l-11.42054,2.34363l5.76289,7.51271l-11.56096,0.68005z" fill="#e6e6e6" stroke="none" stroke-width="1" stroke-linecap="round"/><path d="M307.60103,231.92527l5.57997,-48.58235l13.92271,-0.05818l5.00183,48.64053z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M312.37306,193.82817l1.1502,-9.70145l13.20324,-0.05234l1.01974,9.61973c0,0 -2.76935,1.54619 -7.94426,1.66175c-4.60043,0.10273 -7.42892,-1.52771 -7.42892,-1.52771z" fill="#e6e6e6" stroke="#000000" stroke-width="0" stroke-linecap="butt"/><path d="M296.18267,169.09792c0,-12.27137 10.5977,-22.21926 23.67063,-22.21926c13.07293,0 23.67063,9.9479 23.67063,22.21926c0,12.27137 -10.5977,22.21926 -23.67063,22.21926c-13.07293,0 -23.67063,-9.9479 -23.67063,-22.21926z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M319.82508,190.04072c8.38608,0.14636 14.48812,-3.77583 14.12923,-3.52129c-3.91971,2.77998 -8.80466,4.42926 -14.10102,4.42926c-5.24525,0 -10.087,-1.61761 -13.98728,-4.3491c-0.148,-0.10365 5.57299,3.29478 13.95907,3.44113z" fill="#e6e6e6" stroke="#000000" stroke-width="0" stroke-linecap="butt"/><path d="M301.20412,169.19948c0,-4.77857 3.8738,-8.65236 8.65236,-8.65236c4.77857,0 8.65236,3.8738 8.65236,8.65236c0,4.77857 -3.87379,8.65237 -8.65236,8.65237c-4.77857,0 -8.65236,-3.8738 -8.65236,-8.65237z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M304.36037,169.09792c0,-3.05832 2.47926,-5.53759 5.53759,-5.53759c3.05832,0 5.53759,2.47926 5.53759,5.5376c0,3.05832 -2.47926,5.5376 -5.53759,5.5376c-3.05832,0 -5.53759,-2.47926 -5.53759,-5.5376z" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="butt"/><path d="M328.55574,181.68418c0,0 -5.1757,2.00869 -8.63848,2.02669c-3.46277,0.01799 -9.08938,-1.93457 -9.08938,-1.93457" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M301.20412,169.07665c0,-4.77857 3.8738,-8.65236 8.65236,-8.65236c4.77857,0 8.65236,3.8738 8.65236,8.65236c0,0 -2.83862,-5.30366 -8.81541,-5.26292c-5.86805,0.04 -8.4893,5.48698 -8.4893,5.26292z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M329.85011,177.85184c-4.77857,0 -8.65235,-3.8738 -8.65235,-8.65237c0,-4.77857 3.87379,-8.65236 8.65235,-8.65236c4.77857,0 8.65237,3.8738 8.65237,8.65236c0,4.77857 -3.8738,8.65237 -8.65237,8.65237z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M335.34622,169.09792c0,3.05833 -2.47926,5.5376 -5.53759,5.5376c-3.05832,0 -5.5376,-2.47928 -5.5376,-5.5376c0,-3.05833 2.47927,-5.5376 5.5376,-5.5376c3.05832,0 5.53759,2.47927 5.53759,5.53759z" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="butt"/><path d="M330.01316,163.93656c-5.9768,-0.04074 -8.81541,5.26292 -8.81541,5.26292c0,-4.77857 3.87379,-8.65236 8.65235,-8.65236c4.77857,0 8.65237,3.8738 8.65237,8.65236c0,0.22406 -2.62125,-5.22292 -8.48931,-5.26292z" fill="#ffffff" stroke="#000000" stroke-width="1" stroke-linecap="butt"/><path d="M299.85868,168.13089l1.32656,0.95807" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M338.32892,169.01526l1.54765,-1.25286" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round"/><path d="M305.86096,158.58388c0,0 2.47217,-1.9048 4.34714,-2.3449c1.87497,-0.4401 4.54499,0.2577 4.54499,0.2577c0,0 -2.96196,-0.02222 -4.40994,0.31766c-1.51319,0.35518 -4.48219,1.76952 -4.48219,1.76952z" fill="#000000" stroke="none" stroke-width="1" stroke-linecap="butt"/><path d="M329.42013,156.81436c-1.44798,-0.33988 -4.40994,-0.31767 -4.40994,-0.31767c0,0 2.67002,-0.6978 4.54499,-0.2577c1.87497,0.4401 4.34714,2.3449 4.34714,2.3449c0,0 -2.969,-1.41434 -4.4822,-1.76952z" fill="#000000" stroke="none" stroke-width="1" stroke-linecap="butt"/></g></g></svg><!--rotationCenter:33.11126970288626:52.42528008696419-->`;
  
            if (
              !g.querySelector('svg#ethan') &&
              block.opcode === 'potBlocksByGaia_ethan'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104.43807" height="93.79592" viewBox="0,0,104.43807,93.79592"><g transform="translate(-267.78096,-133.10204)"><g stroke-miterlimit="10"><path d="M322.32583,195.34907c0,0 -31.24785,13.62871 -39.35876,13.62871c-8.11091,0 -14.68611,-6.20698 -14.68611,-13.86368c0,-7.6567 6.57519,-13.86368 14.68611,-13.86368c8.11091,0 39.35876,14.09866 39.35876,14.09866z" fill="#ffffff" stroke="#000000" stroke-linecap="butt"/><path d="M350.99311,157.04771c0,5.45053 -4.62894,9.86906 -10.33902,9.86906c-5.71008,0 -10.33902,-4.41853 -10.33902,-9.86906c0,-5.45053 4.62894,-9.86906 10.33902,-9.86906c5.71008,0 10.33902,4.41853 10.33902,9.86906z" fill="#ab704d" stroke="#000000" stroke-linecap="butt"/><path d="M319.97606,195.11409c3.58411,10.75233 4.92496,20.06351 4.92496,31.28387" fill="none" stroke="#000000" stroke-linecap="round"/><path d="M331.59764,193.23427c4.94842,12.37104 9.87663,18.9013 10.66897,32.49287" fill="none" stroke="#000000" stroke-linecap="round"/><path d="M278.63146,197.27718c3.77731,-3.97217 28.47748,-15.66277 32.45469,-13.65689" fill="none" stroke="#000000" stroke-linecap="round"/><path d="M344.88369,176.78583c5.47525,0 24.46138,9.87827 26.83535,14.54659" fill="none" stroke="#000000" stroke-linecap="round"/><path d="M323.5496,200.86582c-12.37862,-2.77613 -20.0826,-15.41987 -17.20733,-28.24058c2.87527,-12.82072 29.34057,-39.02321 29.34057,-39.02321c0,0 -6.16483,7.63506 -3.25577,25.76411c1.44024,8.97547 19.17873,7.75346 18.74215,23.31234c-0.39783,14.17809 -15.241,20.96346 -27.61962,18.18733z" fill="#ab704d" stroke="#000000" stroke-linecap="butt"/><path d="M322.56081,158.69255c0,5.45053 -4.62894,9.86906 -10.33902,9.86906c-5.71008,0 -10.33902,-4.41853 -10.33902,-9.86906c0,-5.45053 4.62894,-9.86906 10.33902,-9.86906c5.71008,0 10.33902,4.41853 10.33902,9.86906z" fill="#ab704d" stroke="#000000" stroke-linecap="butt"/><path d="M309.43555,182.75749l-13.9652,7.42445l8.7123,-10.78478l-11.85626,-7.7028l16.11243,3.55117" fill="#ab704d" stroke="#000000" stroke-linecap="round"/><path d="M325.24597,171.65145c0,-0.5191 0.42081,-0.93991 0.93991,-0.93991c0.5191,0 0.93991,0.42081 0.93991,0.93991c0,0.5191 -0.42081,0.93991 -0.93991,0.93991c-0.5191,0 -0.93991,-0.42081 -0.93991,-0.93991z" fill="#000000" stroke="none" stroke-linecap="butt"/><path d="M333.77676,171.2148c0,-0.5191 0.42081,-0.93991 0.93991,-0.93991c0.5191,0 0.93991,0.42081 0.93991,0.93991c0,0.5191 -0.42081,0.93991 -0.93991,0.93991c-0.5191,0 -0.93991,-0.42081 -0.93991,-0.93991z" fill="#000000" stroke="none" stroke-linecap="butt"/><path d="M341.13174,179.78112c0,0 0.46258,10.1637 -9.92937,10.31127c-11.45832,0.16271 -12.60267,-9.42018 -12.60267,-9.42018" fill="none" stroke="#000000" stroke-linecap="round"/></g></g></svg><!--rotationCenter:52.21903638370111:46.89796185735844-->`;
  
            if (
              !g.querySelector('svg#buddyeye') &&
              block.opcode === 'potBlocksByGaia_buddyeye'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="buddyeye">
  <image href="https://potentiamod.github.io/extensions/${mehPath}/buddyeye.png" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;
  
  if (
              !g.querySelector('svg#ir') &&
              block.opcode === 'potBlocksByGaia_ir'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="ir">
  <image href="https://potentiamod.github.io/extensions/${mehPath}/ir.png" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;
  
  
            if (
              !g.querySelector('svg#trol') &&
              block.opcode === 'potBlocksByGaia_trol'
            )
              g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2000" height="2000" viewBox="0,0,200,200" id="trol">
              <foreignObject width="200" height="200">
                  <video xmlns="http://www.w3.org/1999/xhtml" width="200" height="200" autoplay="" muted="" loop="">
                      <source src="https://potentiamod.github.io/extensions/${mehPath}/troll.mp4" type="video/mp4" />
                  </video>
              </foreignObject>
  </svg><!--rotationCenter:0:0-->`;
          }
        });
    }
    function label(text, hideFromPalette) {
      hideFromPalette = hideFromPalette ?? false;
      return { blockType: 'label', text, hideFromPalette };
    }
    class potentia {
      getInfo() {
        return {
          id: 'potBlocksByGaia',
          name: 'Image Blocks: Potentia Edition',
          blocks: [
            {
              blockType: Scratch.BlockType.BUTTON,
              func: 'warning',
              text: 'Read me!'
            },
            //we have to use a 0 width character or it will not display correctly
            // i use https://unicode-explorer.com/c/200E
            label('Potentia'),
            {
              disableMonitor: true,
              blockType: 'reporter',
              opcode: 'pb',
              text: '‎',
            },
            label('Dango'),
            {
              disableMonitor: true,
              blockType: 'reporter',
              opcode: 'db',
              text: '‎',
            },
            label('Wenda'),
            {
              disableMonitor: true,
              blockType: 'reporter',
              opcode: 'wenda',
              text: '‎',
            },
            label('Ethan'),
            {
              disableMonitor: true,
              blockType: 'reporter',
              opcode: 'ethan',
              text: '‎',
            },
            label('Buddy\'s Eye', !isPM),
            {
              disableMonitor: true,
              hideFromPalette: !isPM,
              blockType: 'reporter',
              opcode: 'buddyeye',
              text: '‎',
            },
            label('I.R. the Installer', !isPM),
            {
              disableMonitor: true,
              hideFromPalette: !isPM,
              blockType: 'reporter',
              opcode: 'ir',
              text: '‎',
            },
            label('???'),
            {
              disableMonitor: true,
              blockType: 'reporter',
              opcode: 'trol',
              text: '‎',
            },
          ],
        };
      }
      warning() {
          alert(`These blocks will only work when placed in the workspace.`);
      }
      pb() {
        return 'Potentia Block';
      }
      db() {
        return 'Dango Block';
      }
      wenda() {
        return 'Wenda Block';
      }
      ethan() {
        return 'Fool this scumbag!';
      }
      buddyeye() {
        return 'I SEE YOU!!!';
      }
      ir() {
        return 'I\'m not a raccoon dog!';
      }
      trol() {
        return 'bananna';
      }
    }
    function spawnPm() {
      //blockly uses the category name????
      setTimeout(() => {
        injectPotentia('Image Blocks: Potentia Edition');
      }, 25);
    }
    vm.runtime.on('PROJECT_CHANGED', spawnPm);
    vm.runtime.on('BLOCK_DRAG_UPDATE', spawnPm);
    vm.runtime.on('BLOCK_DRAG_END', spawnPm);
    //updating reportvisual to check for special blocks
    const PATCHES_ID = '__patches_';
    window.patch = (obj, functions) => {
      if (obj[PATCHES_ID]) return;
      obj[PATCHES_ID] = {};
      for (const name in functions) {
        const original = obj[name];
        obj[PATCHES_ID][name] = obj[name];
        if (original) {
          obj[name] = function (...args) {
            const callOriginal = (...args) => original.call(this, ...args);
            return functions[name].call(this, callOriginal, ...args);
          };
        } else {
          obj[name] = function (...args) {
            return functions[name].call(this, () => {}, ...args);
          };
        }
      }
    };
    window.unpatch = (obj) => {
      if (!obj[PATCHES_ID]) return;
      for (const name in obj[PATCHES_ID]) {
        obj[name] = obj[PATCHES_ID][name];
      }
      obj[PATCHES_ID] = null;
    };
  
    patch(runtime.constructor.prototype, {
      visualReport(original, blockId, value) {
        let block;
        if (vm.editingTarget) block = vm.editingTarget.blocks.getBlock(blockId);
        if (!block) block = vm.runtime.flyoutBlocks.getBlock(blockId);
        original(blockId, value);
        if (vm.runtime.getEditingTarget().blocks.getBlock([blockId]))
          setTimeout(() => {
            document.querySelectorAll('div.blocklyDropDownDiv').forEach((div) => {
              var reportBox = div.querySelector('div.valueReportBox');
              let block = vm.runtime
                .getEditingTarget()
                .blocks.getBlock([blockId]);
              if (reportBox && block) {
                switch (block.opcode) {
                  case 'potBlocksByGaia_trol':
                    div.style.transform = 'translate(105px, 105px)';
                    break;
                  case 'potBlocksByGaia_pb':
                    div.style.transform = 'translate(0px, 50px)';
                    break;
                  case 'potBlocksByGaia_db':
                    div.style.transform = 'translate(35px, 50px)';
                    break;
                  case 'potBlocksByGaia_wenda':
                    div.style.transform = 'translate(15px, 50px)';
                    break;
                  case 'potBlocksByGaia_ethan':
                    div.style.transform = 'translate(15px, 50px)';
                    break;
                  case 'potBlocksByGaia_buddyeye':
                    div.style.transform = 'translate(15px, 50px)';
                    break;
                  case 'potBlocksByGaia_ir':
                    div.style.transform = 'translate(15px, 50px)';
                    break;
                }
              }
            });
          }, 25);
      },
    });
    Scratch.extensions.register(new potentia());
  })(Scratch);