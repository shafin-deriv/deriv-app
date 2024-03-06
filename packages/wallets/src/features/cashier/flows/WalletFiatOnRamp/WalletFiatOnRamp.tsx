import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { CashierLocked, FiatOnRampModule } from '../../modules';

const WalletFiatOnRamp = () => {
    const { data } = useActiveWalletAccount();
    const history = useHistory();
    const isCrypto = useMemo(() => {
        return data?.currency_config ? data.currency_config.is_crypto : true;
    }, [data?.currency_config]);

    useEffect(() => {
        if (!isCrypto) {
            history.push('/wallets/cashier/deposit');
        }
    }, [history, isCrypto]);

    return (
        <CashierLocked>
            <FiatOnRampModule />
        </CashierLocked>
    );
};

export default WalletFiatOnRamp;
