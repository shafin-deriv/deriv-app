import { action, makeObservable, observable, reaction } from 'mobx';

import { ApiHelpers, load } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';

import { STRATEGIES } from 'Components/quick-strategy/config';
import { TFormData } from 'Components/quick-strategy/types';

import RootStore from './root-store';

export type TActiveSymbol = {
    group: string;
    text: string;
    value: string;
};

export default class QuickStrategyStore {
    root_store: RootStore;
    is_open = false;
    selected_strategy = 'MARTINGALE';
    form_data: { [key: string]: string | number } = {
        symbol: '1HZ100V',
        trade_type: 'callput',
        duration_unit: 't',
    };

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_open: observable,
            selected_strategy: observable,
            form_data: observable,
            setFormVisibility: action,
            setSelectedStrategy: action,
            onSubmit: action,
        });
        this.root_store = root_store;
        reaction(
            () => this.is_open,
            () => {
                if (!this.is_open) {
                    this.selected_strategy = 'MARTINGALE';
                }
            }
        );
    }

    setFormVisibility = (is_open: boolean) => {
        this.is_open = is_open;
    };

    setSelectedStrategy = (strategy: string) => {
        this.selected_strategy = strategy;
    };

    setValue = (name: string, value: string | number) => {
        this.form_data[name] = value;
    };

    onSubmit = async (data: TFormData, run: boolean) => {
        const { contracts_for } = ApiHelpers.instance;
        const market = await contracts_for.getMarketBySymbol(data.symbol);
        const submarket = await contracts_for.getSubmarketBySymbol(data.symbol);
        const trade_type_cat = await contracts_for.getTradeTypeCategoryByTradeType(data.trade_type);
        const selected_strategy = STRATEGIES[this.selected_strategy];
        const strategy_xml = await import(/* webpackChunkName: `[request]` */ `../xml/${selected_strategy.name}.xml`);
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml.default);

        const modifyValueInputs = (key: string, value: number) => {
            const el_value_inputs = strategy_dom.querySelectorAll(`value[strategy_value="${key}"]`);

            el_value_inputs.forEach((el_value_input: HTMLElement) => {
                el_value_input.innerHTML = `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
            });
        };

        const modifyFieldDropdownValues = (name: string, value: string) => {
            const name_list = `${name.toUpperCase()}_LIST`;
            const el_blocks = strategy_dom.querySelectorAll(`field[name="${name_list}"]`);

            el_blocks.forEach((el_block: HTMLElement) => {
                el_block.innerHTML = value;
            });
        };

        const fields_to_update: TFieldsToUpdate = {
            market,
            submarket,
            symbol: data.symbol,
            tradetype: data.trade_type,
            tradetypecat: trade_type_cat,
            durationtype: data.duration_unit,
            duration: data.duration_value,
            stake: data.stake,
            size: data.size,
            alembert_unit: data.unit,
            oscar_unit: data.unit,
            loss: data.loss_threshold,
            profit: data.profit_threshold,
        };

        Object.keys(fields_to_update).forEach(key => {
            const value = fields_to_update[key as keyof typeof fields_to_update];

            if (!isNaN(value as number)) {
                modifyValueInputs(key, value as number);
            } else if (typeof value === 'string') {
                modifyFieldDropdownValues(key, value);
            }
        });

        const { derivWorkspace: workspace } = Blockly;

        if (run) {
            workspace
                .waitForBlockEvent({
                    block_type: 'trade_definition',
                    event_type: Blockly.Events.BLOCK_CREATE,
                    timeout: 5000,
                })
                .then(() => {
                    this.root_store.run_panel.onRunButtonClick();
                });
        }

        this.setFormVisibility(false);

        await load({
            block_string: Blockly.Xml.domToText(strategy_dom),
            file_name: selected_strategy.name,
            workspace,
            from: save_types.UNSAVED,
            drop_event: null,
            strategy_id: null,
            showIncompatibleStrategyDialog: null,
        });
    };
}
