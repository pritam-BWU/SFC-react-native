export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  ProductDetail: {
    productId: string;
  };
  Subscription: undefined;
  MembershipCheckout: {
    planId: 'basic' | 'silver' | 'gold' | 'platinum';
  };
  MembershipSuccess: {
    planId: 'basic' | 'silver' | 'gold' | 'platinum';
  };
  AdminDashboard: undefined;
};
