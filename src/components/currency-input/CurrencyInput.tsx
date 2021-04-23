import { TextInput, TextInputProps } from '@primer/components';
import { useCallback, useEffect, useState } from 'react';

type Props = Omit<TextInputProps, 'onChange'> & {
    prefix?: string;
    value?: number;
    onChange?: (value: number) => void;
};

export default function CurrencyInput({
    value,
    onChange,
    onBlur,
    prefix = '',
    ...props
}: Props) {
    const [innerValue, setInnerValue] = useState<string>('');
    useEffect(() => {
        setInnerValue(parseInputValue(value, prefix));
    }, [value, prefix]);

    const onBlurWrapped = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const output = parseOutputValue(innerValue, prefix);
            !!onChange && onChange(output);
            setInnerValue(parseInputValue(output, prefix));
            !!onBlur && onBlur(e);
        },
        [innerValue, prefix, onChange, onBlur]
    );

    const onChangeWrapped = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = (e.target as HTMLInputElement).value;
            const n = value.replace(/[^0-9.]/g, '');
            setInnerValue(`${prefix}${n}`);
        },
        [setInnerValue, prefix]
    );

    return (
        <TextInput
            {...props}
            value={innerValue}
            type='text'
            onChange={onChangeWrapped}
            onBlur={onBlurWrapped}
        />
    );
}

const parseInputValue = (
    value: string | number | readonly string[] | undefined,
    prefix: string
): string => {
    switch (typeof value) {
        case 'number': {
            return `${prefix}${value.toFixed(2)}`;
        }
        default: {
            return prefix;
        }
    }
};

const parseOutputValue = (value: string, prefix: string): number => {
    const valueWithoutPrefix = value.replace(prefix, '');
    const parsedFloat = parseFloat(valueWithoutPrefix);
    if (isNaN(parsedFloat)) {
        return 0;
    } else {
        return Math.round((parsedFloat + Number.EPSILON) * 100) / 100;
    }
};
