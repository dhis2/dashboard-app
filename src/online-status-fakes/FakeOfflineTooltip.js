import { OfflineTooltip as OriginalOfflineTooltip } from '@dhis2/analytics'

const FakeOfflineTooltip = ({ children }) => children

const getOfflineTooltipComponent = () =>
    process.env.NODE_ENV === 'test'
        ? OriginalOfflineTooltip
        : FakeOfflineTooltip

export const OfflineTooltip = getOfflineTooltipComponent()
