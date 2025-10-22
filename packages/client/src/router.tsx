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
import ConnectionSourceRouter from "./pages/ConnectionSourceRouter";
import ContactPage from "./pages/ContactPage";
import DevToolsPage from "./pages/DevToolsPage";
import DropdownTestPage from "./pages/DropdownTestPage";
import FilesV1Page from "./pages/FilesV1Page";
import TicketsPage from "./pages/TicketsPage";
import TicketGroupDetailPage from "./pages/TicketGroupDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HelpPage from "./pages/HelpPage";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SettingsV1Page from "./pages/SettingsV1Page";
import ProfilePage from "./pages/settings/ProfilePage";
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
			<RoleProtectedRoute allowedRoles={['owner', 'admin']}>
				<FilesV1Page />
			</RoleProtectedRoute>
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
			<ProtectedRoute>
				<ProfilePage />
			</ProtectedRoute>
		),
	},
	{
		path: "/settings/connections",
		element: (
			<MockAuthProvider role="owner">
				<ProtectedRoute>
					<SettingsV1Page />
				</ProtectedRoute>
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/connections/:id",
		element: (
			<MockAuthProvider role="owner">
				<ProtectedRoute>
					<ConnectionSourceRouter />
				</ProtectedRoute>
			</MockAuthProvider>
		),
	},
	{
		path: "/settings/users",
		element: (
			<ProtectedRoute>
				<UsersSettingsPage />
			</ProtectedRoute>
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
				element: <LoginPage />,
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
				path: "/forgot-password",
				element: <ForgotPasswordPage />,
			},
			{
				path: "/reset-password",
				element: <ResetPasswordPage />,
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
