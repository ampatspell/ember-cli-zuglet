const MODELS = new WeakMap();

export const registerModel = (model,  modelName) => {
  MODELS.set(model, { modelName });
  return model;
};

export const getModelName = model => MODELS.get(model)?.modelName;
