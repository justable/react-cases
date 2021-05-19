import React from 'react';
import { withPortal } from '@/components/Portal';

export interface TraceModalProps {
  visible: boolean;
  trigger: HTMLElement | Range | null;
  onSelect?(): void;
  onOk?(): void;
  oncancel?(): void;
}
interface TraceModalState {
  left: number;
  top: number;
}

class TraceModal extends React.Component<TraceModalProps, TraceModalState> {
  state = {
    left: 0,
    top: 0,
  };
  static getDerivedStateFromProps(props: TraceModalProps) {
    const { visible, trigger } = props;
    if (visible && trigger) {
      const rect = trigger.getBoundingClientRect();
      // const srollTop =
      //   document.documentElement.scrollTop ||
      //   window.pageYOffset ||
      //   document.body.scrollTop;
      // return {
      //   top: rect.bottom + 6 + srollTop,
      //   left: rect.left,
      // };
      return {
        top: rect.y + rect.height + 4,
        left: rect.x,
      };
    }
    return null;
  }
  render() {
    const { visible } = this.props;
    const { left, top } = this.state;
    return (
      <div
        style={{
          position: 'fixed',
          zIndex: 1050,
          left,
          top,
          display: visible ? 'block' : 'none',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default withPortal<TraceModalProps>(TraceModal);
