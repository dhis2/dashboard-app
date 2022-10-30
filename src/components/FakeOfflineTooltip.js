import { OfflineTooltip as OriginalOfflineTooltip } from '@dhis2/analytics'
import React from 'react'

const FakeOfflineTooltip = ({ children }) => children

const getOfflineTooltipComponent = () =>
    process.env.NODE_ENV === 'test'
        ? OriginalOfflineTooltip
        : FakeOfflineTooltip

export const OfflineTooltip = getOfflineTooltipComponent()
