import React, { HTMLProps, useRef } from 'react';
import { css, cx } from '@emotion/css';
import uniqueId from 'lodash/uniqueId';
import { GrafanaThemeV2, deprecationWarning } from '@grafana/data';
import { stylesFactory, useTheme2 } from '../../themes';
import { getFocusStyles, getMouseFocusStyles } from '../../themes/mixins';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'value'> {
  value?: boolean;
  /** Make switch's background and border transparent */
  transparent?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, Props>(
  ({ value, checked, disabled = false, onChange, id, ...inputProps }, ref) => {
    if (checked) {
      deprecationWarning('Switch', 'checked prop', 'value');
    }

    const theme = useTheme2();
    const styles = getSwitchStyles(theme);
    const switchIdRef = useRef(id ? id : uniqueId('switch-'));

    return (
      <div className={cx(styles.switch)}>
        <input
          type="checkbox"
          disabled={disabled}
          checked={value}
          onChange={(event) => {
            onChange?.(event);
          }}
          id={switchIdRef.current}
          {...inputProps}
          ref={ref}
        />
        <label htmlFor={switchIdRef.current} />
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export const InlineSwitch = React.forwardRef<HTMLInputElement, Props>(({ transparent, ...props }, ref) => {
  const theme = useTheme2();
  const styles = getSwitchStyles(theme, transparent);

  return (
    <div className={styles.inlineContainer}>
      <Switch {...props} ref={ref} />
    </div>
  );
});

InlineSwitch.displayName = 'Switch';

const getSwitchStyles = stylesFactory((theme: GrafanaThemeV2, transparent?: boolean) => {
  return {
    switch: css`
      width: 32px;
      height: 16px;
      position: relative;

      input {
        opacity: 0;
        left: -100vw;
        z-index: -1000;
        position: absolute;

        &:disabled + label {
          background: ${theme.palette.action.disabledBackground};
          cursor: not-allowed;
        }

        &:checked + label {
          background: ${theme.palette.primary.main};

          &:hover {
            background: ${theme.palette.primary.shade};
          }

          &::after {
            transform: translate3d(18px, -50%, 0);
          }
        }

        &:focus + label,
        &:focus-visible + label {
          ${getFocusStyles(theme)}
        }

        &:focus:not(:focus-visible) + label {
          ${getMouseFocusStyles(theme)}
        }
      }

      label {
        width: 100%;
        height: 100%;
        cursor: pointer;
        border: none;
        border-radius: 50px;
        background: ${theme.palette.secondary.main};
        transition: all 0.3s ease;

        &:hover {
          background: ${theme.palette.secondary.shade};
        }

        &::after {
          position: absolute;
          display: block;
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background: ${theme.palette.text.primary};
          top: 50%;
          transform: translate3d(2px, -50%, 0);
          transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
      }
    `,
    inlineContainer: css`
      padding: ${theme.spacing(0, 1)};
      height: ${theme.spacing(theme.components.height.md)};
      display: flex;
      align-items: center;
      background: ${transparent ? 'transparent' : theme.components.input.background};
      border: 1px solid ${transparent ? 'transparent' : theme.components.input.border};
      border-radius: ${theme.shape.borderRadius()};
    `,
  };
});
