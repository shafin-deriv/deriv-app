import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { Loading } from '@deriv/components';
import { ServerTime, ApiHelpers, setColors } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
import {
    Audio,
    BotFooterExtensions,
    BotNotificationMessages,
    Dashboard,
    NetworkToastPopup,
    RoutePromptDialog,
} from 'Components';
import BlocklyLoading from '../components/blockly-loading';
import { MobxContentProvider } from 'Stores/connect';
import { StoreProvider, useStore } from '@deriv/stores';
import { DBotStoreProvider, useDBotStore } from 'Stores/dbotStore';
import GTM from 'Utils/gtm';
import BotBuilder from 'Components/dashboard/bot-builder';
import './app.scss';

const AppWrapper = ({ passthrough }) => {
    const { root_store, WS } = passthrough;

    return (
        <StoreProvider store={root_store}>
            <DBotStoreProvider ws={WS}>
                <App />
            </DBotStoreProvider>
        </StoreProvider>
    );
};

const App = () => {
    const [is_loading, setIsLoading] = React.useState(true);
    const {
        common,
        client,
        ui: { is_dark_mode_on },
    } = useStore();
    const DBotStores = useDBotStore();
    const { app } = DBotStores;
    const { showDigitalOptionsMaltainvestError } = app;

    React.useEffect(() => {
        setColors(is_dark_mode_on);
    }, [is_dark_mode_on]);

    React.useEffect(() => {
        /**
         * Inject: External Script Hotjar - for DBot only
         */
        (function (h, o, t, j) {
            /* eslint-disable */
            h.hj =
                h.hj ||
                function () {
                    (h.hj.q = h.hj.q || []).push(arguments);
                };
            /* eslint-enable */
            h._hjSettings = { hjid: 3050531, hjsv: 6 };
            const a = o.getElementsByTagName('head')[0];
            const r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }, []);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings.country_code]);

    React.useEffect(() => {
        GTM.init(DBotStores);
        ServerTime.init(common);
        app.setDBotEngineStores(DBotStores);
        ApiHelpers.setInstance(app.api_helpers_store);
        const { active_symbols } = ApiHelpers.instance;
        setIsLoading(true);
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const onDisconnectFromNetwork = () => {
            setIsLoading(false);
        };
        window.addEventListener('offline', onDisconnectFromNetwork);
        return () => {
            window.removeEventListener('offline', onDisconnectFromNetwork);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_loading ? (
        <Loading />
    ) : (
        // TODO: remove MobxContentProvider when all connect method is removed
        <MobxContentProvider store={DBotStores}>
            <BlocklyLoading />
            <div className='bot-dashboard bot'>
                <Audio />
                <BotFooterExtensions />
                <BotNotificationMessages />
                <Dashboard />
                <NetworkToastPopup />
                <BotBuilder />
                <RoutePromptDialog />
            </div>
        </MobxContentProvider>
    );
};

export default AppWrapper;
