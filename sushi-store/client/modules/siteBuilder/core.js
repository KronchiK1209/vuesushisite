// Core registries and helpers for the visual site builder
(function(){
  const elementRegistry = window.SiteBuilderElements;
  const blockRegistry = window.SiteBuilderBlocks;
  const styles = window.SiteBuilderStyles || {};

  if (!elementRegistry) {
    console.error('SiteBuilder: element registry is missing. Did you load /modules/siteBuilder/elements.js?');
    return;
  }

  if (!blockRegistry) {
    console.error('SiteBuilder: block registry is missing. Did you load the /modules/siteBuilder/blocks/*.js modules?');
    return;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function generateId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  }

  function normalizeElement(elementLike) {
    if (!elementLike) {
      return null;
    }
    const type = elementLike.type || 'paragraph';
    const definition = elementRegistry[type];
    if (!definition) {
      return null;
    }
    const base = definition.defaultData ? definition.defaultData() : {};
    const incoming = elementLike.data || {};
    return {
      id: elementLike.id || generateId('element'),
      type,
      data: { ...base, ...incoming }
    };
  }

  function createBlockInstance(type, source = {}) {
    const definition = blockRegistry[type];
    if (!definition) {
      return null;
    }
    const defaults = definition.defaultData ? definition.defaultData() : {};
    const data = source.data || source || {};
    const merged = { ...defaults, ...data };

    if (definition.elements) {
      const elements = Array.isArray(data.elements) ? data.elements : defaults.elements;
      merged.elements = Array.isArray(elements)
        ? elements.map(el => normalizeElement(el)).filter(Boolean)
        : [];
    }

    return {
      id: source.id || generateId('block'),
      type,
      name: definition.name,
      icon: definition.icon,
      data: merged,
      meta: {
        hidden: !!(source.hidden || (source.meta && source.meta.hidden))
      }
    };
  }

  function registerElement(type, definition) {
    if (!type || !definition) {
      return null;
    }
    elementRegistry[type] = definition;
    return elementRegistry[type];
  }

  function registerBlock(type, definition) {
    if (!type || !definition) {
      return null;
    }
    blockRegistry[type] = definition;
    return blockRegistry[type];
  }

  function getElementDefinition(type) {
    return elementRegistry[type] || null;
  }

  function getBlockDefinition(type) {
    return blockRegistry[type] || null;
  }

  window.SiteBuilder = {
    elementRegistry,
    blockRegistry,
    styles,
    deepClone,
    generateId,
    normalizeElement,
    createBlockInstance,
    registerElement,
    registerBlock,
    getElementDefinition,
    getBlockDefinition
  };
})();
