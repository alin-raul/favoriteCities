// Example component in your header/navbar
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const HeaderButtons = () => (
  <header>
    <SignedOut>
      {" "}
      {/* Renders if user is NOT signed in */}
      <SignInButton /> {/* Built-in button to trigger sign-in flow */}
    </SignedOut>
    <SignedIn>
      {" "}
      {/* Renders if user IS signed in */}
      <UserButton /> {/* Built-in button for user menu/sign-out/profile */}
    </SignedIn>
  </header>
);

export default HeaderButtons;
