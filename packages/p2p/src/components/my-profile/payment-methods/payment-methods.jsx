import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import AddPaymentMethod from './add-payment-method';
import EditPaymentMethodForm from './payment-methods-list/edit-payment-method-form.jsx';
import PaymentMethodsEmpty from './payment-methods-empty';
import PaymentMethodsList from './payment-methods-list';

const PaymentMethods = ({ formik_ref }) => {
    const { my_profile_store } = useStores();
    const { data: p2p_advertiser_payment_methods, isRefetching } = useP2PAdvertiserPaymentMethods();

    React.useEffect(() => {
        my_profile_store.setIsLoading(true);
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.setShouldShowAddPaymentMethodForm(false);
        my_profile_store.setShouldShowEditPaymentMethodForm(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    } else if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod formik_ref={formik_ref} should_show_separated_footer={true} />;
    } else if (!p2p_advertiser_payment_methods?.length && !isRefetching) {
        return <PaymentMethodsEmpty />;
    } else if (my_profile_store.should_show_edit_payment_method_form) {
        return <EditPaymentMethodForm formik_ref={formik_ref} />;
    }

    return <PaymentMethodsList />;
};

PaymentMethods.propTypes = {
    formik_ref: PropTypes.shape({ current: PropTypes.any }),
};

export default observer(PaymentMethods);
