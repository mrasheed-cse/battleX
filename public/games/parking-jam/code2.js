gdjs.LeaderboardCode = {};
gdjs.LeaderboardCode.localVariables = [];
gdjs.LeaderboardCode.idToCallbackMap = new Map();
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2_1final = [];
/* BattleX: hide GDevelop logo and edit button on scene load */
setTimeout(function() {
  try {
    var g = window.gdjs && window.gdjs.__currentGame;
    if (!g) return;
    var scene = g.getSceneStack && g.getSceneStack().getCurrentScene();
    if (!scene) return;
    ['GdevelopGLogoWhite','OpenGDevelop_Text','GdevelopGLogoWhite_Background'].forEach(function(name) {
      var objs = scene.getObjects(name);
      if (objs) objs.forEach(function(o) { o.hide(); o.setOpacity(0); });
    });
  } catch(e) {}
}, 100);
setInterval(function() {
  try {
    var g = window.gdjs && window.gdjs.__currentGame;
    if (!g) return;
    var scene = g.getSceneStack && g.getSceneStack().getCurrentScene();
    if (!scene || scene.getName() !== 'Leaderboard') return;
    ['GdevelopGLogoWhite','OpenGDevelop_Text'].forEach(function(name) {
      var objs = scene.getObjects(name);
      if (objs) objs.forEach(function(o) { o.hide(); o.setOpacity(0); });
    });
    /* Also style the player name input */
    var inputs = scene.getObjects('Playername_Input');
    if (inputs && inputs.length > 0) {
      var inp = inputs[0];
      var domEl = document.getElementById('object-' + inp.id) ||
        document.querySelector('input[type="text"]:not([id*="battlex"])');
      if (domEl && !domEl._bxStyled) {
        domEl._bxStyled = true;
        domEl.style.cssText = [
          'background: rgba(168,85,247,0.15)',
          'border: 2px solid rgba(168,85,247,0.7)',
          'border-radius: 10px',
          'color: white',
          'font-family: Arial Black, sans-serif',
          'font-size: 16px',
          'font-weight: 700',
          'text-align: center',
          'padding: 10px 16px',
          'outline: none',
          'box-shadow: 0 0 20px rgba(168,85,247,0.3)',
          'width: 100%',
          'box-sizing: border-box'
        ].join(';');
        domEl.placeholder = '✏️  Enter your name...';
        domEl.addEventListener('focus', function() {
          domEl.style.borderColor = '#a855f7';
          domEl.style.boxShadow = '0 0 28px rgba(168,85,247,0.55)';
        });
        domEl.addEventListener('blur', function() {
          domEl.style.borderColor = 'rgba(168,85,247,0.7)';
          domEl.style.boxShadow = '0 0 20px rgba(168,85,247,0.3)';
        });
      }
    }
  } catch(e) {}
}, 300);

gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3_1final = [];

gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2_1final = [];

gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3_1final = [];

gdjs.LeaderboardCode.GDEndMessage_9595TextObjects1= [];
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects2= [];
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects3= [];
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects4= [];
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects5= [];
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects1= [];
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2= [];
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3= [];
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4= [];
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects5= [];
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects1= [];
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects2= [];
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3= [];
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects4= [];
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects5= [];
gdjs.LeaderboardCode.GDPlayername_9595InputObjects1= [];
gdjs.LeaderboardCode.GDPlayername_9595InputObjects2= [];
gdjs.LeaderboardCode.GDPlayername_9595InputObjects3= [];
gdjs.LeaderboardCode.GDPlayername_9595InputObjects4= [];
gdjs.LeaderboardCode.GDPlayername_9595InputObjects5= [];
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects1= [];
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2= [];
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects3= [];
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects4= [];
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects5= [];
gdjs.LeaderboardCode.GDCoinIconObjects1= [];
gdjs.LeaderboardCode.GDCoinIconObjects2= [];
gdjs.LeaderboardCode.GDCoinIconObjects3= [];
gdjs.LeaderboardCode.GDCoinIconObjects4= [];
gdjs.LeaderboardCode.GDCoinIconObjects5= [];
gdjs.LeaderboardCode.GDCoinObjects1= [];
gdjs.LeaderboardCode.GDCoinObjects2= [];
gdjs.LeaderboardCode.GDCoinObjects3= [];
gdjs.LeaderboardCode.GDCoinObjects4= [];
gdjs.LeaderboardCode.GDCoinObjects5= [];
gdjs.LeaderboardCode.GDCarObjects1= [];
gdjs.LeaderboardCode.GDCarObjects2= [];
gdjs.LeaderboardCode.GDCarObjects3= [];
gdjs.LeaderboardCode.GDCarObjects4= [];
gdjs.LeaderboardCode.GDCarObjects5= [];
gdjs.LeaderboardCode.GDObstacleObjects1= [];
gdjs.LeaderboardCode.GDObstacleObjects2= [];
gdjs.LeaderboardCode.GDObstacleObjects3= [];
gdjs.LeaderboardCode.GDObstacleObjects4= [];
gdjs.LeaderboardCode.GDObstacleObjects5= [];
gdjs.LeaderboardCode.GDParkingLotObjects1= [];
gdjs.LeaderboardCode.GDParkingLotObjects2= [];
gdjs.LeaderboardCode.GDParkingLotObjects3= [];
gdjs.LeaderboardCode.GDParkingLotObjects4= [];
gdjs.LeaderboardCode.GDParkingLotObjects5= [];
gdjs.LeaderboardCode.GDScore_9595TextObjects1= [];
gdjs.LeaderboardCode.GDScore_9595TextObjects2= [];
gdjs.LeaderboardCode.GDScore_9595TextObjects3= [];
gdjs.LeaderboardCode.GDScore_9595TextObjects4= [];
gdjs.LeaderboardCode.GDScore_9595TextObjects5= [];
gdjs.LeaderboardCode.GDBlackOverlayObjects1= [];
gdjs.LeaderboardCode.GDBlackOverlayObjects2= [];
gdjs.LeaderboardCode.GDBlackOverlayObjects3= [];
gdjs.LeaderboardCode.GDBlackOverlayObjects4= [];
gdjs.LeaderboardCode.GDBlackOverlayObjects5= [];
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects1= [];
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects2= [];
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects3= [];
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects4= [];
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects5= [];
gdjs.LeaderboardCode.GDCollisionDustObjects1= [];
gdjs.LeaderboardCode.GDCollisionDustObjects2= [];
gdjs.LeaderboardCode.GDCollisionDustObjects3= [];
gdjs.LeaderboardCode.GDCollisionDustObjects4= [];
gdjs.LeaderboardCode.GDCollisionDustObjects5= [];
gdjs.LeaderboardCode.GDGoUpObjects1= [];
gdjs.LeaderboardCode.GDGoUpObjects2= [];
gdjs.LeaderboardCode.GDGoUpObjects3= [];
gdjs.LeaderboardCode.GDGoUpObjects4= [];
gdjs.LeaderboardCode.GDGoUpObjects5= [];
gdjs.LeaderboardCode.GDGoLeftObjects1= [];
gdjs.LeaderboardCode.GDGoLeftObjects2= [];
gdjs.LeaderboardCode.GDGoLeftObjects3= [];
gdjs.LeaderboardCode.GDGoLeftObjects4= [];
gdjs.LeaderboardCode.GDGoLeftObjects5= [];
gdjs.LeaderboardCode.GDGoDownObjects1= [];
gdjs.LeaderboardCode.GDGoDownObjects2= [];
gdjs.LeaderboardCode.GDGoDownObjects3= [];
gdjs.LeaderboardCode.GDGoDownObjects4= [];
gdjs.LeaderboardCode.GDGoDownObjects5= [];
gdjs.LeaderboardCode.GDGoRightObjects1= [];
gdjs.LeaderboardCode.GDGoRightObjects2= [];
gdjs.LeaderboardCode.GDGoRightObjects3= [];
gdjs.LeaderboardCode.GDGoRightObjects4= [];
gdjs.LeaderboardCode.GDGoRightObjects5= [];
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects1= [];
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2= [];
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects3= [];
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects4= [];
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects5= [];
gdjs.LeaderboardCode.GDGrassObjects1= [];
gdjs.LeaderboardCode.GDGrassObjects2= [];
gdjs.LeaderboardCode.GDGrassObjects3= [];
gdjs.LeaderboardCode.GDGrassObjects4= [];
gdjs.LeaderboardCode.GDGrassObjects5= [];
gdjs.LeaderboardCode.GDPauseButtonObjects1= [];
gdjs.LeaderboardCode.GDPauseButtonObjects2= [];
gdjs.LeaderboardCode.GDPauseButtonObjects3= [];
gdjs.LeaderboardCode.GDPauseButtonObjects4= [];
gdjs.LeaderboardCode.GDPauseButtonObjects5= [];
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects1= [];
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2= [];
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3= [];
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4= [];
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects5= [];
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects1= [];
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2= [];
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects3= [];
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects4= [];
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects5= [];
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects1= [];
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects2= [];
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects3= [];
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects4= [];
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects5= [];
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects1= [];
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects2= [];
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects3= [];
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects4= [];
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects5= [];


gdjs.LeaderboardCode.mapOfGDgdjs_9546LeaderboardCode_9546GDCarObjects2Objects = Hashtable.newFrom({"Car": gdjs.LeaderboardCode.GDCarObjects2});
gdjs.LeaderboardCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
gdjs.LeaderboardCode.GDCarObjects2.length = 0;

{gdjs.evtTools.object.createObjectOnScene(runtimeScene, gdjs.LeaderboardCode.mapOfGDgdjs_9546LeaderboardCode_9546GDCarObjects2Objects, gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0) + gdjs.randomInRange(-(gdjs.evtTools.camera.getCameraWidth(runtimeScene, "", 0)) / 2, gdjs.evtTools.camera.getCameraWidth(runtimeScene, "", 0) / 2), gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0) + gdjs.evtTools.camera.getCameraHeight(runtimeScene, "", 0) / 2, "");
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].activateBehavior("DraggablePhysics", false);
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].getBehavior("Animation").pauseAnimation();
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].setAnimationFrame(gdjs.randomInRange(0, 8));
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].setZOrder(0);
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].getBehavior("Physics2").setFixedRotation(false);
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].setAngle(gdjs.randomInRange(0, 360));
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects2[i].getBehavior("Physics2").applyPolarImpulse(gdjs.randomInRange(235, 315), 50, (gdjs.LeaderboardCode.GDCarObjects2[i].getCenterXInScene()), (gdjs.LeaderboardCode.GDCarObjects2[i].getCenterYInScene()));
}
}
}

}


};gdjs.LeaderboardCode.eventsList1 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__RepeatEveryXSeconds__Repeat.func(runtimeScene, "SpawnCars", 0.5, null);
if (isConditionTrue_0) {

{ //Subevents
gdjs.LeaderboardCode.eventsList0(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Car"), gdjs.LeaderboardCode.GDCarObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDCarObjects1.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDCarObjects1[i].getCenterYInScene() > gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0) + gdjs.evtTools.camera.getCameraHeight(runtimeScene, "", 0) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDCarObjects1[k] = gdjs.LeaderboardCode.GDCarObjects1[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDCarObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDCarObjects1 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDCarObjects1.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDCarObjects1[i].deleteFromScene(runtimeScene);
}
}
}

}


};gdjs.LeaderboardCode.eventsList2 = function(runtimeScene, asyncObjectsList) {

{


let isConditionTrue_0 = false;
{
/* BattleX: auth banner suppressed */
}

}


};gdjs.LeaderboardCode.asyncCallback9464084 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.LeaderboardCode.localVariables);
gdjs.copyArray(runtimeScene.getObjects("SpeedrunResults_Text"), gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3);
{for(var i = 0, len = gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3[i].getBehavior("Text").setText("Time: " + gdjs.evtsExt__ExtendedMath__ToFixedString.func(runtimeScene, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(0)), 2, null) + " seconds");
}
}
{gdjs.evtTools.camera.showLayer(runtimeScene, "UI");
}

{ //Subevents
gdjs.LeaderboardCode.eventsList2(runtimeScene, asyncObjectsList);} //End of subevents
gdjs.LeaderboardCode.localVariables.length = 0;
}
gdjs.LeaderboardCode.idToCallbackMap.set(9464084, gdjs.LeaderboardCode.asyncCallback9464084);
gdjs.LeaderboardCode.eventsList3 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.LeaderboardCode.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(5), (runtimeScene) => (gdjs.LeaderboardCode.asyncCallback9464084(runtimeScene, asyncObjectsList)), 9464084, asyncObjectsList);
}
}

}


};gdjs.LeaderboardCode.eventsList4 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{

{ //Subevents
gdjs.LeaderboardCode.eventsList3(runtimeScene);} //End of subevents
}

}


};gdjs.LeaderboardCode.eventsList5 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4);
gdjs.copyArray(runtimeScene.getObjects("PauseButton"), gdjs.LeaderboardCode.GDPauseButtonObjects4);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDPauseButtonObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDPauseButtonObjects4[i].getBehavior("ButtonFSM").IsHovered(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDPauseButtonObjects4[k] = gdjs.LeaderboardCode.GDPauseButtonObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDPauseButtonObjects4.length = k;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].getBehavior("ButtonFSM").IsHovered(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(15271508);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4 */
/* Reuse gdjs.LeaderboardCode.GDPauseButtonObjects4 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDPauseButtonObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPauseButtonObjects4[i].setColor("189;16;224");
}
for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].setColor("189;16;224");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3);
gdjs.copyArray(runtimeScene.getObjects("PauseButton"), gdjs.LeaderboardCode.GDPauseButtonObjects3);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDPauseButtonObjects3.length;i<l;++i) {
    if ( !(gdjs.LeaderboardCode.GDPauseButtonObjects3[i].getBehavior("ButtonFSM").IsHovered(null)) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDPauseButtonObjects3[k] = gdjs.LeaderboardCode.GDPauseButtonObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDPauseButtonObjects3.length = k;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length;i<l;++i) {
    if ( !(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].getBehavior("ButtonFSM").IsHovered(null)) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3 */
/* Reuse gdjs.LeaderboardCode.GDPauseButtonObjects3 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDPauseButtonObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPauseButtonObjects3[i].setColor("255;255;255");
}
for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].setColor("255;255;255");
}
}
}

}


};gdjs.LeaderboardCode.eventsList6 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4);
gdjs.copyArray(runtimeScene.getObjects("PauseButton"), gdjs.LeaderboardCode.GDPauseButtonObjects4);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDPauseButtonObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDPauseButtonObjects4[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDPauseButtonObjects4[k] = gdjs.LeaderboardCode.GDPauseButtonObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDPauseButtonObjects4.length = k;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4 */
/* Reuse gdjs.LeaderboardCode.GDPauseButtonObjects4 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDPauseButtonObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPauseButtonObjects4[i].setColor("74;74;74");
}
for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].setColor("74;74;74");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3);
gdjs.copyArray(runtimeScene.getObjects("PauseButton"), gdjs.LeaderboardCode.GDPauseButtonObjects3);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDPauseButtonObjects3.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDPauseButtonObjects3[i].getBehavior("ButtonFSM").IsIdle(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDPauseButtonObjects3[k] = gdjs.LeaderboardCode.GDPauseButtonObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDPauseButtonObjects3.length = k;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].getBehavior("ButtonFSM").IsIdle(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(15275204);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3 */
/* Reuse gdjs.LeaderboardCode.GDPauseButtonObjects3 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDPauseButtonObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPauseButtonObjects3[i].setColor("255;255;255");
}
for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].setColor("255;255;255");
}
}
}

}


};gdjs.LeaderboardCode.eventsList7 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("OpenGDevelop_Text"), gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i].getBehavior("ButtonFSM").IsHovered(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[k] = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(9468948);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4);
/* Reuse gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i].setColor("189;16;224");
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].setColor("189;16;224");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].getBehavior("ButtonFSM").IsHovered(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(9471420);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4 */
gdjs.copyArray(runtimeScene.getObjects("OpenGDevelop_Text"), gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4);
{for(var i = 0, len = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i].setColor("189;16;224");
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].setColor("189;16;224");
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3);
gdjs.copyArray(runtimeScene.getObjects("OpenGDevelop_Text"), gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length;i<l;++i) {
    if ( !(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].getBehavior("ButtonFSM").IsHovered(null)) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length;i<l;++i) {
    if ( !(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i].getBehavior("ButtonFSM").IsHovered(null)) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[k] = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3 */
/* Reuse gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i].setColor("255;255;255");
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].setColor("255;255;255");
}
}
}

}


};gdjs.LeaderboardCode.eventsList8 = function(runtimeScene) {

{

gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = 0;

gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length = 0;


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3_1final.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4);
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_1 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length; j < jLen ; ++j) {
        if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3_1final.indexOf(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[j]) === -1 )
            gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3_1final.push(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4[j]);
    }
}
}
{
gdjs.copyArray(runtimeScene.getObjects("OpenGDevelop_Text"), gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4);
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i].getBehavior("ButtonFSM").IsPressed(null) ) {
        isConditionTrue_1 = true;
        gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[k] = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length; j < jLen ; ++j) {
        if ( gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3_1final.indexOf(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[j]) === -1 )
            gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3_1final.push(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4[j]);
    }
}
}
{
gdjs.copyArray(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3_1final, gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3);
gdjs.copyArray(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3_1final, gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3);
}
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(9479492);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3 */
/* Reuse gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i].setColor("74;74;74");
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].setColor("74;74;74");
}
}
}

}


{

gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2.length = 0;

gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2.length = 0;


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2_1final.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("GdevelopGLogoWhite"), gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3);
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i].getBehavior("ButtonFSM").IsClicked(null) ) {
        isConditionTrue_1 = true;
        gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[k] = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length; j < jLen ; ++j) {
        if ( gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2_1final.indexOf(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[j]) === -1 )
            gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2_1final.push(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3[j]);
    }
}
}
{
gdjs.copyArray(runtimeScene.getObjects("OpenGDevelop_Text"), gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3);
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i].getBehavior("ButtonFSM").IsClicked(null) ) {
        isConditionTrue_1 = true;
        gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[k] = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length = k;
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length; j < jLen ; ++j) {
        if ( gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2_1final.indexOf(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[j]) === -1 )
            gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2_1final.push(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3[j]);
    }
}
}
{
gdjs.copyArray(gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2_1final, gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2);
gdjs.copyArray(gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2_1final, gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2 */
/* Reuse gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2 */
{for(var i = 0, len = gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2[i].setColor("255;255;255");
}
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2[i].setColor("255;255;255");
}
}
{gdjs.evtTools.window.openURL("https://bit.ly/ParkingJam", runtimeScene);
}
}

}


};gdjs.LeaderboardCode.eventsList9 = function(runtimeScene) {

{


gdjs.LeaderboardCode.eventsList5(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList6(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList7(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList8(runtimeScene);
}


};gdjs.LeaderboardCode.asyncCallback9486892 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.LeaderboardCode.localVariables);
{runtimeScene.getGame().getVariables().getFromIndex(1).setNumber(1);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Title Screen", false);
}
gdjs.LeaderboardCode.localVariables.length = 0;
}
gdjs.LeaderboardCode.idToCallbackMap.set(9486892, gdjs.LeaderboardCode.asyncCallback9486892);
gdjs.LeaderboardCode.eventsList10 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.LeaderboardCode.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(0.25), (runtimeScene) => (gdjs.LeaderboardCode.asyncCallback9486892(runtimeScene, asyncObjectsList)), 9486892, asyncObjectsList);
}
}

}


};gdjs.LeaderboardCode.eventsList11 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("StartOver_Button"), gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2[k] = gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.sound.stopSoundOnChannel(runtimeScene, 1);
}
{gdjs.evtTools.sound.playSound(runtimeScene, "Coin.wav", false, 50, 2);
}

{ //Subevents
gdjs.LeaderboardCode.eventsList10(runtimeScene);} //End of subevents
}

}


};gdjs.LeaderboardCode.eventsList12 = function(runtimeScene) {

{
/* BattleX: submit score directly from game code */
var _bxName = (gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length > 0)
  ? gdjs.LeaderboardCode.GDPlayername_9595InputObjects2[0].getText().trim()
  : "Anonymous";
if (!_bxName) _bxName = "Anonymous";

/* Read game variables directly */
var _gameVars = runtimeScene.getGame().getVariables();
var _timeMs   = Math.round(_gameVars.getFromIndex(0).getAsNumber() * 1000);
var _level    = Math.round(_gameVars.getFromIndex(1).getAsNumber());
var _score    = Math.round(_gameVars.getFromIndex(2).getAsNumber());

console.log("[BattleX] Submit clicked — name:", _bxName, "time:", _timeMs, "score:", _score);

/* Direct API call — no postMessage dependency */
fetch("https://battle-x.vercel.app/api/leaderboard", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    game:            "parking-jam",
    playerName:      _bxName.slice(0, 24),
    speedrunTimeMs:  _timeMs,
    speedrunTime:    _gameVars.getFromIndex(0).getAsNumber(),
    score:           _score,
    level:           Math.max(1, _level),
    speedrunEnabled: true
  })
}).then(function(r) {
  console.log("[BattleX] API status:", r.status);
  return r.json();
}).then(function(data) {
  console.log("[BattleX] API response:", JSON.stringify(data));
  /* Show leaderboard overlay */
  setTimeout(function() {
    if (window.__battlex && window.__battlex.showLeaderboard) {
      window.__battlex.showLeaderboard(_bxName);
    }
  }, 600);
}).catch(function(err) {
  console.error("[BattleX] API error:", err.message || err);
});
}

};gdjs.LeaderboardCode.eventsList13 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.leaderboards.hasSavingErrored("6459b38b-a566-48ec-912c-5542cb1807ac");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Playername_Input"), gdjs.LeaderboardCode.GDPlayername_9595InputObjects2);
gdjs.copyArray(runtimeScene.getObjects("SubmitScoreButton"), gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2);
{for(var i = 0, len = gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2[i].hide(false);
}
}
{runtimeScene.getScene().getVariables().getFromIndex(0).setBoolean(false);
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPlayername_9595InputObjects2[i].setDisabled(false);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.leaderboards.hasBeenSaved("6459b38b-a566-48ec-912c-5542cb1807ac");
if (isConditionTrue_0) {
{gdjs.evtTools.leaderboards.displayLeaderboard(runtimeScene, "6459b38b-a566-48ec-912c-5542cb1807ac", true);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Title Screen", true);
}
}

}


};gdjs.LeaderboardCode.eventsList14 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = false; /* BattleX: isSaving always false — button stays visible */

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.leaderboards.isSaving("6459b38b-a566-48ec-912c-5542cb1807ac"));
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(9367860);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.LeaderboardCode.eventsList13(runtimeScene);} //End of subevents
}

}


};gdjs.LeaderboardCode.eventsList15 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.playerAuthentication.isAuthenticated();
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(9452724);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Playername_Input"), gdjs.LeaderboardCode.GDPlayername_9595InputObjects2);
{for(var i = 0, len = gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPlayername_9595InputObjects2[i].getBehavior("Text").setText(gdjs.playerAuthentication.getUsername());
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("SubmitScoreButton"), gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !runtimeScene.getScene().getVariables().getFromIndex(0).getAsBoolean();
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length;i<l;++i) {
    if ( gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2[k] = gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2[i];
        ++k;
    }
}
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length = k;
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Playername_Input"), gdjs.LeaderboardCode.GDPlayername_9595InputObjects2);
{runtimeScene.getScene().getVariables().getFromIndex(0).setBoolean(true);
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPlayername_9595InputObjects2[i].setDisabled(true);
}
}
{gdjs.evtTools.sound.playSound(runtimeScene, "Coin.wav", false, 50, 2);
}

{ //Subevents
gdjs.LeaderboardCode.eventsList12(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getScene().getVariables().getFromIndex(0).getAsBoolean();
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.LeaderboardCode.eventsList14(runtimeScene);} //End of subevents
}

}


};gdjs.LeaderboardCode.eventsList16 = function(runtimeScene) {

{


gdjs.LeaderboardCode.eventsList9(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList11(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList15(runtimeScene);
}


};gdjs.LeaderboardCode.eventsList17 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Playername_Input"), gdjs.LeaderboardCode.GDPlayername_9595InputObjects2);
gdjs.copyArray(runtimeScene.getObjects("SpeedRunTime_Text"), gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2);
gdjs.copyArray(runtimeScene.getObjects("StartOver_Button"), gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2);
gdjs.copyArray(runtimeScene.getObjects("SubmitScoreButton"), gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2);
{gdjs.evtTools.sound.playSoundOnChannel(runtimeScene, "assets\\audio\\audience_cheers_13.aac", 10, false, 50, 1);
}
{for(var i = 0, len = gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2[i].setCenterXInScene(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0));
}
for(var i = 0, len = gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDPlayername_9595InputObjects2[i].setCenterXInScene(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0));
}
for(var i = 0, len = gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2[i].setCenterXInScene(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0));
}
for(var i = 0, len = gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2.length ;i < len;++i) {
    gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2[i].setCenterXInScene(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0));
}
}
{gdjs.evtTools.camera.hideLayer(runtimeScene, "UI");
}

{ //Subevents
gdjs.LeaderboardCode.eventsList4(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.camera.layerIsVisible(runtimeScene, "UI");
if (isConditionTrue_0) {

{ //Subevents
gdjs.LeaderboardCode.eventsList16(runtimeScene);} //End of subevents
}

}


};gdjs.LeaderboardCode.eventsList18 = function(runtimeScene) {

{


gdjs.LeaderboardCode.eventsList1(runtimeScene);
}


{


gdjs.LeaderboardCode.eventsList17(runtimeScene);
}


};

gdjs.LeaderboardCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.LeaderboardCode.GDEndMessage_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects1.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects3.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects4.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects5.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects1.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects2.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects3.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects4.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects5.length = 0;
gdjs.LeaderboardCode.GDCoinObjects1.length = 0;
gdjs.LeaderboardCode.GDCoinObjects2.length = 0;
gdjs.LeaderboardCode.GDCoinObjects3.length = 0;
gdjs.LeaderboardCode.GDCoinObjects4.length = 0;
gdjs.LeaderboardCode.GDCoinObjects5.length = 0;
gdjs.LeaderboardCode.GDCarObjects1.length = 0;
gdjs.LeaderboardCode.GDCarObjects2.length = 0;
gdjs.LeaderboardCode.GDCarObjects3.length = 0;
gdjs.LeaderboardCode.GDCarObjects4.length = 0;
gdjs.LeaderboardCode.GDCarObjects5.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects1.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects2.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects3.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects4.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects5.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects1.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects2.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects3.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects4.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects5.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects1.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects2.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects3.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects4.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects5.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects1.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects2.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects3.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects4.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects5.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects1.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects2.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects3.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects4.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects5.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects1.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects2.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects3.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects4.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects5.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects1.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects2.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects3.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects4.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects5.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects1.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects2.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects3.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects4.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects5.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDGrassObjects1.length = 0;
gdjs.LeaderboardCode.GDGrassObjects2.length = 0;
gdjs.LeaderboardCode.GDGrassObjects3.length = 0;
gdjs.LeaderboardCode.GDGrassObjects4.length = 0;
gdjs.LeaderboardCode.GDGrassObjects5.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects1.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects5.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects5.length = 0;

gdjs.LeaderboardCode.eventsList18(runtimeScene);
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDEndMessage_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDOpenGDevelop_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDSpeedrunResults_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects1.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects2.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects3.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects4.length = 0;
gdjs.LeaderboardCode.GDPlayername_9595InputObjects5.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDSubmitScoreButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects1.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects2.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects3.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects4.length = 0;
gdjs.LeaderboardCode.GDCoinIconObjects5.length = 0;
gdjs.LeaderboardCode.GDCoinObjects1.length = 0;
gdjs.LeaderboardCode.GDCoinObjects2.length = 0;
gdjs.LeaderboardCode.GDCoinObjects3.length = 0;
gdjs.LeaderboardCode.GDCoinObjects4.length = 0;
gdjs.LeaderboardCode.GDCoinObjects5.length = 0;
gdjs.LeaderboardCode.GDCarObjects1.length = 0;
gdjs.LeaderboardCode.GDCarObjects2.length = 0;
gdjs.LeaderboardCode.GDCarObjects3.length = 0;
gdjs.LeaderboardCode.GDCarObjects4.length = 0;
gdjs.LeaderboardCode.GDCarObjects5.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects1.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects2.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects3.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects4.length = 0;
gdjs.LeaderboardCode.GDObstacleObjects5.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects1.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects2.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects3.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects4.length = 0;
gdjs.LeaderboardCode.GDParkingLotObjects5.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDScore_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects1.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects2.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects3.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects4.length = 0;
gdjs.LeaderboardCode.GDBlackOverlayObjects5.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDCurrentLevel_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects1.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects2.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects3.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects4.length = 0;
gdjs.LeaderboardCode.GDCollisionDustObjects5.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects1.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects2.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects3.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects4.length = 0;
gdjs.LeaderboardCode.GDGoUpObjects5.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects1.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects2.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects3.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects4.length = 0;
gdjs.LeaderboardCode.GDGoLeftObjects5.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects1.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects2.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects3.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects4.length = 0;
gdjs.LeaderboardCode.GDGoDownObjects5.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects1.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects2.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects3.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects4.length = 0;
gdjs.LeaderboardCode.GDGoRightObjects5.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects1.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects2.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects3.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects4.length = 0;
gdjs.LeaderboardCode.GDSpeedRunTime_9595TextObjects5.length = 0;
gdjs.LeaderboardCode.GDGrassObjects1.length = 0;
gdjs.LeaderboardCode.GDGrassObjects2.length = 0;
gdjs.LeaderboardCode.GDGrassObjects3.length = 0;
gdjs.LeaderboardCode.GDGrassObjects4.length = 0;
gdjs.LeaderboardCode.GDGrassObjects5.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDPauseButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects1.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects2.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects3.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects4.length = 0;
gdjs.LeaderboardCode.GDGdevelopGLogoWhiteObjects5.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDStartOver_9595ButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDNextLevel_9595ButtonObjects5.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects1.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects2.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects3.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects4.length = 0;
gdjs.LeaderboardCode.GDPaused_9595ButtonObjects5.length = 0;


return;

}

gdjs['LeaderboardCode'] = gdjs.LeaderboardCode;
