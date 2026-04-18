
if (typeof gdjs.evtsExt__ExtendedMath__Fibonacci !== "undefined") {
  gdjs.evtsExt__ExtendedMath__Fibonacci.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__ExtendedMath__Fibonacci = {};
gdjs.evtsExt__ExtendedMath__Fibonacci.idToCallbackMap = new Map();


gdjs.evtsExt__ExtendedMath__Fibonacci.userFunc0xcecda8 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
function fibonacci(n) {
    let initial = 0;
    let final = 1;
    let sum = 0;

    let i = 0;
    for(i = 2; i <= n; i++) {
        sum = initial + final;

        initial = final;
        final = sum;
    }
    return n ? final : initial;
}

const n = eventsFunctionContext.getArgument("n");

eventsFunctionContext.returnValue = fibonacci(n);
};
gdjs.evtsExt__ExtendedMath__Fibonacci.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__ExtendedMath__Fibonacci.userFunc0xcecda8(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__ExtendedMath__Fibonacci.func = function(runtimeScene, n, parentEventsFunctionContext) {
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
if (argName === "n") return n;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__ExtendedMath__Fibonacci.eventsList0(runtimeScene, eventsFunctionContext);


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__ExtendedMath__Fibonacci.registeredGdjsCallbacks = [];