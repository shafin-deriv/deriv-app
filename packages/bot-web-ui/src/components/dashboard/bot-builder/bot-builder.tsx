import React from 'react';
import classNames from 'classnames';

import { observer } from '@deriv/stores';

import { useDBotStore } from '../../../stores/useDBotStore';
import LoadModal from '../../load-modal';
import QuickStrategy1 from '../../quick-strategy';
import SaveModal from '../dashboard-component/load-bot-preview/save-modal';
import BotBuilderTourHandler from '../dbot-tours/bot-builder-tour';

import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { dashboard, app, quick_strategy_store_1 } = useDBotStore();
    const { active_tab, active_tour, is_preview_on_popup } = dashboard;
    const { is_open } = quick_strategy_store_1;

    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    return (
        <>
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': active_tour,
                })}
            >
                {is_preview_on_popup ? null : (
                    <div
                        id='scratch_div'
                        ref={el_ref}
                        style={{
                            width: 'calc(100vw - 3.2rem)',
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <WorkspaceWrapper />
                    </div>
                )}
            </div>
            {active_tab === 1 && <BotBuilderTourHandler />}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            {is_open && <QuickStrategy1 />}
        </>
    );
});

export default BotBuilder;
