import React, { ReactElement } from 'react';
import classNames from 'classnames';
import ContentLoader from 'react-content-loader';
import { getContractTypeName } from '@deriv/bot-skeleton';
import { Icon, IconTradeTypes, Popover } from '@deriv/components';
import { convertDateFormat } from '@deriv/shared';
import { transaction_elements } from 'Constants/transactions';
import { TColumn, TDesktopTransactionTable, TTableCell } from './types';

const PARENT_CLASS = 'transaction-details-modal-desktop';

const TableCell = ({ label = '', extra_classes = [], loader = false }: TTableCell) => {
    return (
        <div className={classNames(`${PARENT_CLASS}__table-cell`, ...extra_classes)}>
            {loader ? <CellLoader /> : label}
        </div>
    );
};

const TableHeader = ({ columns = [] }: { columns: TColumn[] }) => (
    <div className={classNames(`${PARENT_CLASS}__table-row`, `${PARENT_CLASS}__table-header`)}>
        {columns.map(column => (
            <TableCell
                key={column.key}
                extra_classes={[column.extra_class ? `${PARENT_CLASS}__table-cell${column.extra_class}` : '']}
                label={column.label}
                loader={false}
            />
        ))}
    </div>
);

const IconWrapper = ({ message, icon }: { message: string; icon: ReactElement }) => (
    <div className={`${PARENT_CLASS}__icon-wrapper`}>
        <Popover alignment='left' message={message} zIndex={'7'}>
            {icon}
        </Popover>
    </div>
);

const CellLoader = () => (
    <ContentLoader
        className='transactions__loader-text'
        height={10}
        width={80}
        speed={3}
        backgroundColor={'var(--general-section-2)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='0' y='0' rx='0' ry='0' width='100' height='12' />
    </ContentLoader>
);

export default function DesktopTransactionTable({
    result,
    result_columns,
    transactions = [],
    transaction_columns,
}: TDesktopTransactionTable) {
    return (
        <>
            <div
                className={classNames(
                    `${PARENT_CLASS}__table-container`,
                    `${PARENT_CLASS}__table-container__top-table`
                )}
            >
                <TableHeader columns={transaction_columns} />
                {transactions?.map((transaction, index) => {
                    const { data, type } = transaction;
                    if (type === transaction_elements.CONTRACT) {
                        return (
                            <div className={`${PARENT_CLASS}__table-row`} key={data?.transaction_ids?.buy}>
                                <TableCell
                                    label={
                                        data?.date_start ??
                                        convertDateFormat(
                                            data?.date_start,
                                            'YYYY-M-D HH:mm:ss [GMT]',
                                            'YYYY-MM-DD HH:mm:ss [GMT] ZZ'
                                        )
                                    }
                                    extra_classes={[`${PARENT_CLASS}__table-cell--grow-big`]}
                                />
                                <TableCell
                                    label={data?.transaction_ids?.buy}
                                    extra_classes={[`${PARENT_CLASS}__table-cell--grow-mid`]}
                                />
                                <TableCell
                                    label={
                                        <IconWrapper
                                            message={data?.display_name}
                                            icon={<Icon icon={`IcUnderlying${data?.underlying}`} size={24} />}
                                        />
                                    }
                                />
                                <TableCell
                                    label={
                                        <IconWrapper
                                            message={getContractTypeName(data)}
                                            icon={<IconTradeTypes type={data?.contract_type} size={24} />}
                                        />
                                    }
                                />
                                <TableCell label={data?.entry_tick} loader={!data.is_completed} />
                                <TableCell label={data?.exit_tick} loader={!data.is_completed} />
                                <TableCell label={data?.buy_price} />
                                <TableCell
                                    label={
                                        <div
                                            className={classNames({
                                                [`${PARENT_CLASS}__profit--win`]: data?.profit > 0,
                                                [`${PARENT_CLASS}__profit--loss`]: data?.profit < 0,
                                            })}
                                        >
                                            {Math.abs(data?.profit)}
                                        </div>
                                    }
                                    loader={!data.is_completed}
                                />
                            </div>
                        );
                    }

                    return (
                        <div className={`${PARENT_CLASS}__table-row`} key={`transaction-row-divider-${index}`}>
                            <div className={`${PARENT_CLASS}__divider`}>
                                <div className='transactions__divider-line' />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={classNames(`${PARENT_CLASS}__table-container`)}>
                <TableHeader columns={result_columns} />
                <div className={`${PARENT_CLASS}__table-row`}>
                    <TableCell label={result?.number_of_runs ?? ''} />
                    <TableCell label={result?.total_stake ?? ''} />
                    <TableCell label={result?.total_payout ?? ''} />
                    <TableCell label={result?.won_contracts ?? ''} />
                    <TableCell label={result?.lost_contracts ?? ''} extra_classes={[`${PARENT_CLASS}__loss`]} />
                    <TableCell
                        label={
                            <div
                                className={classNames(
                                    result?.total_profit && {
                                        [`${PARENT_CLASS}__profit--win`]: result?.total_profit > 0,
                                        [`${PARENT_CLASS}__profit--loss`]: result?.total_profit < 0,
                                    }
                                )}
                            >
                                {Math.abs(result?.total_profit || 0).toFixed(2)}
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
}
