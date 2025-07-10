import type { Directive } from 'vue';

const clickOutside: Directive = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event: Event) => {
      // here I check that click was outside the el and its children
      if (!(el === event.target || el.contains(event.target as Node))) {
        // and if it did, call method provided in attribute value
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default clickOutside;