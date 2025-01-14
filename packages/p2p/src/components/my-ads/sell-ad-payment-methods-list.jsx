import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import './sell-ad-payment-methods-list.scss';

const SellAdPaymentMethodsList = ({
    is_only_horizontal = isMobile(),
    is_scrollable = isMobile(),
    onClickAdd,
    onClickPaymentMethodCard,
    p2p_advertiser_payment_methods,
    selected_methods,
}) => {
    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    // payment method order: Bank Transfer -> EWallets -> Others
    const payment_method_order = { bank_transfer: 0, other: 2 };
    const getPaymentMethodOrder = method => (!(method in payment_method_order) ? 1 : payment_method_order[method]);
    const sortPaymentMethods = payment_methods_list => {
        return payment_methods_list.sort((i, j) => getPaymentMethodOrder(i.method) - getPaymentMethodOrder(j.method));
    };

    return (
        <ThemedScrollbars
            className={classNames('sell-ad-payment-methods__container', {
                'sell-ad-payment-methods__container--horizontal': is_only_horizontal,
            })}
            is_scrollbar_hidden
            is_scrollable={is_scrollable}
            is_only_horizontal={is_only_horizontal}
        >
            {p2p_advertiser_payment_methods &&
                sortPaymentMethods(p2p_advertiser_payment_methods).map((payment_method, key) => (
                    <PaymentMethodCard
                        is_vertical_ellipsis_visible={false}
                        key={key}
                        medium
                        onClick={() => onClickPaymentMethodCard(payment_method)}
                        payment_method={payment_method}
                        style={selected_methods.includes(payment_method.id) ? style : {}}
                    />
                ))}
            <PaymentMethodCard is_add label={localize('Payment method')} medium onClickAdd={onClickAdd} />
        </ThemedScrollbars>
    );
};

SellAdPaymentMethodsList.propTypes = {
    is_only_horizontal: PropTypes.bool,
    is_scrollable: PropTypes.bool,
    onClickAdd: PropTypes.func,
    onClickPaymentMethodCard: PropTypes.func,
    p2p_advertiser_payment_methods: PropTypes.array,
    selected_methods: PropTypes.array,
};

export default observer(SellAdPaymentMethodsList);
