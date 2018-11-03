import Octokit from '@octokit/rest'
import React, { PureComponent } from 'react'

import { ErrorBoundary } from '../../libs/bugsnag'
import { FlatList } from '../../libs/lists'
import { contentPadding } from '../../styles/variables'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { ThemeConsumer } from '../context/ThemeContext'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  notifications: Octokit.ActivityGetNotificationsResponseItem[]
  repoIsKnown?: boolean
  swipeable?: boolean
}

export interface NotificationCardsState {}

export class NotificationCards extends PureComponent<
  NotificationCardsProps,
  NotificationCardsState
> {
  keyExtractor(notification: Octokit.ActivityGetNotificationsResponseItem) {
    return `notification-card-${notification.id}`
  }

  renderItem = ({
    item: notification,
  }: {
    item: Octokit.ActivityGetNotificationsResponseItem
  }) => {
    if (this.props.swipeable) {
      return (
        <SwipeableNotificationCard
          notification={notification}
          repoIsKnown={this.props.repoIsKnown}
        />
      )
    }

    return (
      <ErrorBoundary>
        <NotificationCard
          notification={notification}
          repoIsKnown={this.props.repoIsKnown}
        />
      </ErrorBoundary>
    )
  }

  render() {
    const { notifications } = this.props
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <TransparentTextOverlay
            color={theme.backgroundColor}
            size={contentPadding}
            from="vertical"
          >
            <FlatList
              key="notification-cards-flat-list"
              data={notifications}
              ItemSeparatorComponent={CardItemSeparator}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </TransparentTextOverlay>
        )}
      </ThemeConsumer>
    )
  }
}