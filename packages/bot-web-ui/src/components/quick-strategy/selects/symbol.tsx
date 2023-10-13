import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';

import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';

import { useDBotStore } from 'Stores/useDBotStore';

type TSymbol = {
    component?: React.ReactNode;
    text: string;
    value: string;
    group: string;
};

type TMarketOption = {
    symbol: TSymbol;
};

const MarketOption: React.FC<TMarketOption> = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon data_testid='dt_symbol_icon' icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

type TSymbolSelect = {
    fullWidth?: boolean;
};

const SymbolSelect: React.FC<TSymbolSelect> = ({ fullWidth = false }) => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { setValue } = quick_strategy_store_1;
    const [active_symbols, setActiveSymbols] = React.useState([]);
    const { setFieldValue } = useFormikContext();

    React.useEffect(() => {
        const { active_symbols } = ApiHelpers.instance;
        setActiveSymbols(active_symbols.getSymbolsForBot());
    }, []);

    const symbols = React.useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullWidth })}>
            <Field name='symbol' key='asset' id='asset'>
                {({ field: { value, ...rest_field } }: FieldProps) => {
                    const selected_symbol = symbols.find(symbol => symbol.value === value);
                    return (
                        <>
                            <Autocomplete
                                {...rest_field}
                                data-testid='qs_autocomplete_symbol'
                                autoComplete='off'
                                className='qs__autocomplete'
                                value={selected_symbol?.text || ''}
                                list_items={symbols}
                                onItemSelection={(item: TItem) => {
                                    if (item?.value) {
                                        setFieldValue?.('symbol', (item as TSymbol)?.value as string);
                                        setValue('symbol', (item as TSymbol)?.value as string);
                                    }
                                }}
                                leading_icon={<Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />}
                            />
                        </>
                    );
                }}
            </Field>
        </div>
    );
};

export default SymbolSelect;
