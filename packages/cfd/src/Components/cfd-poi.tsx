import { ProofOfIdentityContainerForMt5 } from '@deriv/account';
import React from 'react';
import { useStore, observer } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';

type TCFDValue = {
    poi_state: string;
};

type TFormValues = {
    poi_state?: string;
};

export type TCFDPOIProps = {
    index: number;
    onSubmit: (index: number, value: TCFDValue) => void;
    value: TCFDValue;
    addNotificationMessageByKey: TCoreStores['notifications']['addNotificationMessageByKey'];
    height: string;
    onSave: (index: number, values: TFormValues) => void;
    removeNotificationByKey: TCoreStores['notifications']['removeNotificationByKey'];
    removeNotificationMessage: TCoreStores['notifications']['removeNotificationMessage'];
    jurisdiction_selected_shortcode: string;
};

const CFDPOI = observer(({ index, onSave, onSubmit, height, ...props }: TCFDPOIProps) => {
    const { client, common, notifications, traders_hub } = useStore();

    const {
        account_status,
        fetchResidenceList,
        is_switching,
        is_virtual,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        account_settings,
        residence_list,
        getChangeableFields,
        updateAccountStatus,
    } = client;
    const { routeBackInApp, app_routing_history } = common;
    const { refreshNotifications } = notifications;
    const { is_eu_user } = traders_hub;

    const poi_props = {
        account_status,
        fetchResidenceList,
        is_switching,
        is_virtual,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        account_settings,
        residence_list,
        routeBackInApp,
        app_routing_history,
        refreshNotifications,
        getChangeableFields,
        updateAccountStatus,
        is_eu_user,
        ...props,
    };

    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = account_settings?.citizen || account_settings?.country_code;
    const citizen_data = residence_list?.find(item => item.value === citizen);

    const onStateChange = (status: string) => {
        setPOIState(status);
        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state });
    };
    return (
        <ProofOfIdentityContainerForMt5
            {...poi_props}
            height={height}
            is_from_external={true}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    );
});

export default CFDPOI;
