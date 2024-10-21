var compatibleLayout = function compatibleLayout(layout) {
  var layoutEnum = ['sidemenu', 'topmenu'];

  if (layoutEnum.includes(layout)) {
    return layout === null || layout === void 0 ? void 0 : layout.replace('menu', '');
  }

  return layout;
};

export default compatibleLayout;