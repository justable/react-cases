import { ComponentType, Component } from 'react';
import ReactDOM from 'react-dom';
import { isBrowser } from 'umi';

export function withPortal<P>(C: ComponentType<P>) {
  return class extends Component<P> {
    root?: HTMLElement;

    constructor(props: P) {
      super(props);
      if (!this.root && isBrowser()) {
        this.root = document.createElement('div');
        document.body.appendChild(this.root);
      }
    }

    componentWillUnmount() {
      this.root && this.root.remove();
    }

    renderContent() {
      return <C {...this.props} />;
    }

    render() {
      return this.root ? (
        ReactDOM.createPortal(this.renderContent(), this.root)
      ) : (
        <p>加载中...</p>
      );
    }
  };
}
