# Push Notification Admin Panel Implementation Plan

## Context

The Anvaya Beach Resort Bali PWA currently has service worker infrastructure with push notification support (VAPID keys configured), but lacks an admin interface to create, schedule, and manage push notifications. This implementation adds a comprehensive notification management system to the backoffice, enabling admins to send promotional offers, event announcements, and general announcements to all users.

## Requirements

- **Notification Types**: Promotional offers, Event announcements, General announcements
- **Delivery Options**: Immediate send OR scheduled for specific date/time
- **Targeting**: Broadcast to all users (all subscribed devices)
- **History**: Full history with stats (sent count, delivered, clicked)

---

## Implementation Plan

### 1. Create Notification Type Definition

**File**: `src/types/notifications.ts`

Define the notification data structure:
```typescript
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'promo' | 'event' | 'announcement';
  icon?: string;
  imageUrl?: string;
  url?: string; // Deep link on notification click
  scheduledFor?: Date; // If undefined, send immediately
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentAt?: Date;
  createdAt: Date;
  createdBy: string; // Admin email
  stats: {
    sent: number;
    delivered: number;
    clicked: number;
  };
}
```

### 2. Create Notification Service

**File**: `src/services/notificationService.ts`

Handle push subscriptions and notification operations:
- `subscribeUser()`: Save user's push subscription to Firestore
- `unsubscribeUser()`: Remove user's push subscription
- `getAllSubscriptions()`: Fetch all push subscriptions (for broadcast)
- `sendNotification()`: Send push to all subscriptions via Cloud Function
- `scheduleNotification()`: Create scheduled notification in Firestore
- `getNotificationHistory()`: Fetch notification history with stats
- `updateNotificationStats()`: Track delivery/click events

### 3. Create Admin Notification Management Page

**File**: `src/views/backoffice/NotificationsView.vue`

Features:
- **Create Notification Form**:
  - Title, body (textarea)
  - Type selector (promo/event/announcement)
  - Optional image URL
  - Optional deep link URL
  - Delivery option: Immediate OR Scheduled (date/time picker)
  - Preview of notification

- **Notification List**:
  - Tabs: All, Scheduled, Sent, Draft
  - Cards showing notification details
  - Status badges with scheduled time
  - Actions: Edit (drafts only), Delete, Cancel Schedule, Resend
  - Stats display (sent/delivered/clicked counts)

### 4. Add Router Route

**File**: `src/router/index.ts`

Add new route under backoffice:
```typescript
{
  path: 'notifications',
  name: 'backoffice-notifications',
  component: () => import('@/views/backoffice/NotificationsView.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

### 5. Add Navigation Menu Item

**File**: `src/views/backoffice/BackofficeLayout.vue`

Add "Notifications" to sidebar:
```vue
<router-link to="/backoffice/notifications" class="nav-item">
  <i class="mdi mdi-bell-ring"></i>
  <span>Notifications</span>
</router-link>
```

### 6. Update Service Worker

**File**: `public/sw.js`

Add notification click tracking:
```javascript
self.addEventListener('notificationclick', event => {
  event.notification.close();

  // Track click event via Cloud Function
  const notificationId = event.notification.data.primaryKey;
  // Call analytics endpoint

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
  }
});
```

### 7. Extend PWA Service

**File**: `src/services/pwa.ts` (extend existing)

Update to save subscription to Firestore:
```typescript
export async function saveSubscriptionToFirestore(subscription: PushSubscription) {
  const subscriptionData = {
    endpoint: subscription.endpoint,
    keys: subscription.toJSON().keys,
    createdAt: new Date(),
    userAgent: navigator.userAgent
  };

  await addDoc(collection(db, 'pushSubscriptions'), subscriptionData);
}
```

---

## Firebase Cloud Functions

**Directory**: `functions/` (create new Cloud Functions project)

1. **Initialize Cloud Functions** (if not already set up):
```bash
firebase init functions
```

2. **Create Notification Functions** (`functions/src/index.ts`):

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = functions.config().vapid.public_key;
const VAPID_PRIVATE_KEY = functions.config().vapid.private_key;
const VAPID_SUBJECT = 'mailto:admin@anvayabali.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Send notification immediately
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { title, body, type, icon, imageUrl, url } = data;

  // Get all subscriptions
  const subscriptionsSnap = await admin.firestore()
    .collection('pushSubscriptions')
    .get();

  const results = await Promise.allSettled(
    subscriptionsSnap.docs.map(doc => {
      const subscription = doc.data();
      return webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: subscription.keys
      }, JSON.stringify({ title, body, icon, imageUrl, url }));
    })
  );

  // Create notification record
  const notificationRef = await admin.firestore().collection('notifications').add({
    title, body, type, icon, imageUrl, url,
    status: 'sent',
    sentAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: context.auth.token.email,
    stats: {
      sent: results.filter(r => r.status === 'fulfilled').length,
      delivered: 0,
      clicked: 0
    }
  });

  return { notificationId: notificationRef.id };
});

// Scheduled notification sender (runs every minute)
exports.sendScheduledNotifications = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  const now = admin.firestore.FieldValue.serverTimestamp();

  const scheduled = await admin.firestore()
    .collection('notifications')
    .where('status', '==', 'scheduled')
    .where('scheduledFor', '<=', now)
    .get();

  for (const doc of scheduled.docs) {
    const data = doc.data();
    await sendNotificationInternal(data);
    await doc.ref.update({ status: 'sent', sentAt: now });
  }
});

// Track notification click
exports.trackNotificationClick = functions.https.onCall(async (data, context) => {
  const { notificationId } = data;
  await admin.firestore()
    .collection('notifications')
    .doc(notificationId)
    .update({ 'stats.clicked': admin.firestore.FieldValue.increment(1) });
});
```

3. **Environment Variables**:
```bash
firebase functions:config:set vapid.public_key="YOUR_KEY" vapid.private_key="YOUR_KEY"
```

---

## Files to Create/Modify

### New Files
1. `src/types/notifications.ts` - Type definitions
2. `src/services/notificationService.ts` - Client-side service
3. `src/views/backoffice/NotificationsView.vue` - Admin page
4. `src/components/NotificationDetailModal.vue` - Detail modal
5. `functions/src/index.ts` - Cloud Functions
6. `functions/package.json` - Functions dependencies

### Modified Files
1. `src/router/index.ts` - Add route
2. `src/views/backoffice/BackofficeLayout.vue` - Add nav item
3. `src/services/pwa.ts` - Extend for subscription saving
4. `public/sw.js` - Add click tracking
5. `firebase.json` - Ensure functions configured

---

## Firestore Collections

Create new collections:
- **`pushSubscriptions`**: User push subscription endpoints
- **`notifications`**: Notification records with stats

---

## Dependencies

**For Cloud Functions**:
```bash
cd functions
npm install web-push firebase-admin firebase-functions
npm install -D typescript @types/web-push
```

---

## Verification Steps

1. **Test Permission Request**:
   - Open app, grant notification permission
   - Verify subscription is saved to Firestore `pushSubscriptions`

2. **Test Immediate Send**:
   - In backoffice, create notification
   - Select "Send Immediately"
   - Verify notification appears on subscribed devices
   - Check `notifications` collection for sent record

3. **Test Scheduled Send**:
   - Create notification with future date/time
   - Verify status is "scheduled"
   - Wait for scheduled time or trigger manually
   - Verify status changes to "sent"

4. **Test History**:
   - View notification history page
   - Verify all sent notifications appear
   - Check stats (sent/delivered/clicked)

5. **Test Notification Click**:
   - Click on received notification
   - Verify deep link opens correct page
   - Verify click count increments

6. **Test Notification Preview**:
   - Preview should match actual notification appearance
