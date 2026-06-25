export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  PasswordChange: undefined;
  Home: undefined;
  Categories:
    | {
        categoryId?: string;
      }
    | undefined;
  Notifications: undefined;
  Profile: undefined;
  ProductDetail: {
    productId: string;
  };
  QualitySource: {
    categoryId: string;
  };
  SearchResults: {
    query: string;
  };
  Subscription: undefined;
  MembershipPlanList: {
    membershipType: 'flexible' | 'durable';
  };
  MembershipPlanDetail: {
    membershipType: 'flexible' | 'durable';
    planId: 'starter' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  };
  MembershipCheckout: {
    membershipType: 'flexible' | 'durable';
    planId: 'starter' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  };
  MembershipSuccess: {
    membershipType: 'flexible' | 'durable';
    planId: 'starter' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  };
  AdminDashboard: undefined;
};
