import { createRouter, createWebHashHistory } from 'vue-router'
import SignupEnterEmailView from '../views/authentication/SignupEnterEmailView.vue'
import EmailVerificationPendingView from '../views/authentication/EmailVerificationPendingView.vue'
import EmailOtpInputPageView from '../views/authentication/EmailOtpInputPageView.vue'
import LoginEmailPasswordView from '../views/authentication/LoginEmailPasswordView.vue'
import LoginMfaPageView from '../views/authentication/LoginMfaPageView.vue'
import PasswordResetEmailInputView from '../views/authentication/PasswordResetEmailInputView.vue'
import PasswordResetEmailVerifyView from '../views/authentication/PasswordResetEmailVerifyView.vue'
import PasswordResetMfaView from '../views/authentication/PasswordResetMfaView.vue'
import PasswordResetInputPasswordView from '../views/authentication/PasswordResetInputPasswordView.vue'
import VerifiedRedirectionPageView from '../views/authentication/VerifiedRedirectionPageView.vue'
// dashboard imports
//import PoolViewPage from '../views/dashboard/PoolViewPage.vue'
import DepositListView from '../views/dashboard/DepositListView.vue'
import WithdrawlListView from '../views/dashboard/WithdrawlListView.vue'
//import PoolDescriptionView from '../views/pool/PoolDescriptionView.vue'
import PaymentSuccessPageView from '../views/pool/PaymentSuccessPageView.vue'

// trading
//import TradingTerminalView from '../views/trade/TradingTerminalView.vue'

import MembersListModalView from '../views/pool/MembersListModalView.vue'


const routes = [
  {
    path: '/sign_up_enter_email_view',
    name: 'SignupEnterEmailView',
    component: SignupEnterEmailView
  },
  {
    path: '/email_verification_pending_view',
    name: 'EmailVerificationPendingView',
    component: EmailVerificationPendingView
  },
  {
    path: '/email_otp_input_page_view',
    name: 'EmailOtpInputPageView',
    component: EmailOtpInputPageView
  },
  {
    path: '/login_email_password_view',
    name: 'LoginEmailPasswordView',
    component: LoginEmailPasswordView
  },
  {
    path: '/login_mfa_page_view',
    name: 'LoginMfaPageView',
    component: LoginMfaPageView
  },
  {
    path: '/password_reset_email_input_view',
    name: 'PasswordResetEmailInputVuew',
    component: PasswordResetEmailInputView
  },
  {
    path: '/password_reset_email_verify_view',
    name: 'PasswordResetEmailVerifyView',
    component: PasswordResetEmailVerifyView
  },
  {
    path: '/password_reset_mfa_view',
    name: 'PasswordResetMfaView',
    component: PasswordResetMfaView
  },
  {
    path: '/password_reset_input_password_view',
    name: 'PasswordResetInputPasswordView',
    component: PasswordResetInputPasswordView
  },
  {
    path: '/verified_redirection_page_view',
    name: 'VerifiedRedirectionPageView',
    component: VerifiedRedirectionPageView
  },
  {
    path: '/',
    name: 'SignupEnterEmailView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: SignupEnterEmailView
  },

  // dashboard paths
  {
    path: '/pool_view_page',
    name: 'PoolViewPage',
    component: () => import(/* webpackChunkName: "pool_view_page" */ '../views/dashboard/PoolViewPage.vue')
  },
  {
    path: '/deposit_list_view',
    name: 'DepositListView',
    component: DepositListView
  },
  {
    path: '/withdrawl_list_view',
    name: 'WithdrawlListView',
    component: WithdrawlListView
  },

  // pool pages
  {
    path: '/pool_description_view',
    name: 'PoolDescriptionView',
    component: () => import(/* webpackChunkName: "pool_description_view" */ '../views/pool/PoolDescriptionView.vue')
  },

  {
    path: '/payment_success_page_view',
    name: 'PaymentSuccessPageView',
    component: PaymentSuccessPageView
  },

  {
    path: '/member_list_modal_view',
    name: 'MembersListModalView',
    component: MembersListModalView
  },


  // trading
  
  {
    path: '/trading_terminal_view',
    name: 'TradingTerminalView',
    component: () => import(/* webpackChunkName: "trading_terminal_view" */ '../views/trade/TradingTerminalView.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
