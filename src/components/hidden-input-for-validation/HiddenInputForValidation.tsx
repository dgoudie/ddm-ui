import React, { useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames';
import styles from './HiddenInputForValidation.module.scss';

type Props = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & { invalidMessage: string };

export default function HiddenInputForValidation({
    invalidMessage,
    value,
    ...props
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const invalidEventHandler = useCallback(
        (event) => {
            event.target.setCustomValidity(invalidMessage);
        },
        [invalidMessage]
    );

    useEffect(() => {
        const input = inputRef.current;
        input?.addEventListener('invalid', invalidEventHandler);
        return () => {
            input?.removeEventListener('invalid', invalidEventHandler);
        };
    }, [inputRef, invalidEventHandler]);

    useEffect(() => {
        inputRef.current?.setCustomValidity('');
        inputRef.current?.checkValidity();
    }, [value, inputRef]);

    return (
        <input
            {...props}
            value={value}
            ref={inputRef}
            onChange={() => null}
            className={classNames(styles.input, props.className)}
            tabIndex={-1}
        />
    );
}
