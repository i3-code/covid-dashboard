export default class Component {
  constructor(tagName = 'div', parent, cssClass = '', content = '') {
    const element = document.createElement(tagName);
    if (cssClass) element.classList.add(cssClass);
    if (content) element.innerHTML = content;
    if (parent) parent.appendChild(element);
    this.node = element;
  }
}
