import type { App, DirectiveBinding } from 'vue';

const tooltipDirective = (app: App<Element>) => {
  app.directive('tooltip', {
    mounted(el, binding) {
      init(el, binding);
    },
    updated(el, binding) {
      init(el, binding);
    },
  });
};

function init(el: HTMLElement, binding: DirectiveBinding<any>) {
  if (binding.value) {
    const position = binding.arg || 'top';
    const tooltipText = binding.value;
    el.setAttribute('position', position);
    el.setAttribute('tooltip', tooltipText);
  } else {
    el.removeAttribute('position');
    el.removeAttribute('tooltip');
  }
}

export default tooltipDirective;
