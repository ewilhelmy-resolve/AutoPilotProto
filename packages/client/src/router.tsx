import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { RootLayout } from "./components/layouts/RootLayout";
import { SSEProvider } from "./contexts/SSEContext";
import { MockAuthProvider } from "./components/dev/MockAuthProvider";
import ChatV1Page from "./pages/ChatV1Page";
import ConnectionSourceDetailPage from "./pages/ConnectionSourceDetailPage";
import ContactPage from "./pages/ContactPage";
import DevToolsPage from "./pages/DevToolsPage";
import DropdownTestPage from "./pages/DropdownTestPage";
import FilesV1Page from "./pages/FilesV1Page";
import HelpPage from "./pages/HelpPage";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import SettingsV1Page from "./pages/SettingsV1Page";
import { SignUpPage } from "./pages/SignUpPage";
import ProfilePage from "./pages/settings/ProfilePage";
import ITSMConfigurationPage from "./pages/settings/ITSMConfigurationPage";
import ITSMSourcesPage from "./pages/settings/ITSMSourcesPage";
import TermsOfService from "./pages/TermsOfService";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import TicketGroupDetailPage from "./pages/TicketGroupDetailPage";
import UsersSettingsPage from "./pages/UsersSettingsPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { VerifyEmailSentPage } from "./pages/VerifyEmailSentPage";

const router = createBrowserRouter([
	// Root redirect
	{
		path: "/",
		element: <Navigate to="/chat" replace />,
	},
	// Main application routes
	{
		path: "/chat",
		element: (
			<MockAuthProvider role="owner">
				<SSEProvider apiUrl={import.meta.env.VITE_API_URL || ''} enabled={true}>
					<ChatV1Page />
				</SSEProvider>
			</MockAuthProvider>
		),
	},
	{
		path: "/chat/:conversationId",
		element: (
			<MockAuthProvider role="owner">
				<SSEProvider apiUrl={import.meta.env.VITE_API_URL || ''} enabled={true}>
					<ChatV1Page />
				</SSEProvider>
			</MockAuthProvider>
		),
	},
	{
		path: "/content",
		element: (
			<MockAuthProvider role="owner">
				<FilesV1Page />
			</MockAuthProvider>
		),
	},
	{
		path: "/tickets",
		element: (
			<MockAuthProvider role="owner">
				<SSEProvider apiUrl={import.meta.env.VITE_API_URL || ''} enabled={true}>
					<TicketsPage />
				</SSEProvider>
			</MockAuthProvider>
		),
	},
	{
		path: "/tickets/:groupId/:ticketId",
		element: (
			<MockAuthProvider role="owner">
				<SSEProvider apiUrl={import.meta.env.VITE_API_URL || ''} enabled={true}>
					<TicketDetailPage />
				</SSEProvider>
			</MockAuthProvider>
		),
	},
	{
		path: "/tickets/:groupId",
		element: (
			<MockAuthProvider role="owner">
				<SSEProvider apiUrl={import.meta.env.VITE_API_URL || ''} enabled={true}>
					<TicketGroupDetailPage />
				</SSEProvider>
			</MockAuthProvider>
		),
	},
	{
		path: "/settings",
		element: <Navigate to="/settings/profile" replace />,
	},
	{
		path: "/settings/profile",
		element: (
			<MockAuthProvider role="owner">
				<ProfilePage />
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/connections",
		element: (
			<MockAuthProvider role="owner">
				<SettingsV1Page />
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/connections/:id",
		element: (
			<MockAuthProvider role="owner">
				<ConnectionSourceDetailPage />
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/users",
		element: (
			<MockAuthProvider role="owner">
				<UsersSettingsPage />
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/itsm",
		element: (
			<MockAuthProvider role="owner">
				<ITSMSourcesPage />
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/itsm/:id",
		element: (
			<MockAuthProvider role="owner">
				<ITSMConfigurationPage />
			</MockAuthProvider>
		),
	},
	// Placeholder routes - to be implemented with UX designs
	{
		path: "/account",
		element: (
			<ProtectedRoute>
				{/* Account settings - awaiting UX design */}
				<div>Account settings page (coming soon)</div>
			</ProtectedRoute>
		),
	},
	{
		path: "/contact",
		element: (
			<ProtectedRoute>
				<ContactPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/help",
		element: (
			<ProtectedRoute>
				<HelpPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/payment",
		element: (
			<ProtectedRoute>
				{/* Payment management - awaiting UX design */}
				<div>Payment management (coming soon)</div>
			</ProtectedRoute>
		),
	},
	{
		path: "/analytics",
		element: (
			<ProtectedRoute>
				{/* Analytics dashboard - future feature */}
				<div>Analytics dashboard (future feature)</div>
			</ProtectedRoute>
		),
	},
	{
		path: "/devtools",
		element: (
			<ProtectedRoute>
				<DevToolsPage />
			</ProtectedRoute>
		),
	},
	// Test pages (public)
	{
		path: "/test/dropdown",
		element: <DropdownTestPage />,
	},
	// Auth and utility pages
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "/login",
				element: <SignUpPage />,
			},
			{
				path: "/verify-email",
				element: <VerifyEmailPage />,
			},
			{
				path: "/verify-email-sent",
				element: <VerifyEmailSentPage />,
			},
			{
				path: "/invite",
				element: <InviteAcceptPage />,
			},
			{
				path: "/terms-of-service",
				element: <TermsOfService />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);

export function AppRouter() {
	return <RouterProvider router={router} />;
}
