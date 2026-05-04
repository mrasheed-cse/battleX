
if (typeof gdjs.evtsExt__ExtendedMath__IsoToCartesianX !== "undefined") {
  gdjs.evtsExt__ExtendedMath__IsoToCartesianX.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__ExtendedMath__IsoToCartesianX = {};
gdjs.evtsExt__ExtendedMath__IsoToCartesianX.idToCallbackMap = new Map();


gdjs.evtsExt__ExtendedMath__IsoToCartesianX.userFunc0xc6e4c8 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
const x = eventsFunctionContext.getArgument("x");
const y = eventsFunctionContext.getArgument("y");

eventsFunctionContext.returnValue = (2 * y + x) * 0.5;
};
gdjs.evtsExt__ExtendedMath__IsoToCartesianX.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__ExtendedMath__IsoToCartesianX.userFunc0xc6e4c8(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__ExtendedMath__IsoToCartesianX.func = function(runtimeScene, x, y, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("ExtendedMath"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("ExtendedMath"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "x") return x;
if (argName === "y") return y;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__ExtendedMath__IsoToCartesianX.eventsList0(runtimeScene, eventsFunctionContext);


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__ExtendedMath__IsoToCartesianX.registeredGdjsCallbacks = [];