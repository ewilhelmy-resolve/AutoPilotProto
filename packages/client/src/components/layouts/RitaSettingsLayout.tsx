"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { useProfilePermissions } from "@/hooks/api/useProfile";
import { cn } from "@/lib/utils";

interface RitaSettingsLayoutProps {
	children?: ReactNode;
}

export default function RitaSettingsLayout({
	children,
}: RitaSettingsLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { isOwnerOrAdmin } = useProfilePermissions();
	const [connectionSourcesOpen, setConnectionSourcesOpen] = useState(true);

	const handleBackToApp = () => {
		// Navigate to root, which will redirect to the default app route
		navigate("/");
	};

	// Check if current path matches route (including sub-routes)
	const isKnowledgeSourcesActive = location.pathname.startsWith("/settings/connections");
	const isItsmSourcesActive = location.pathname.startsWith("/settings/itsm");
	const isConnectionSourcesActive = isKnowledgeSourcesActive || isItsmSourcesActive;
	const isUsersActive = location.pathname.startsWith("/settings/users");
	const isProfileActive = location.pathname === "/settings/profile";

	return (
		<SidebarProvider defaultOpen={true}>
			<Sidebar collapsible="none" className="w-64 max-w-64">
				<SidebarHeader className="p-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className="flex items-center gap-2 p-2 h-8 rounded-md cursor-pointer"
								onClick={handleBackToApp}
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="text-sm">Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent>
					{/* Profile */}
					<SidebarGroup className="p-2">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									className={cn(
										"p-2 h-8 rounded-md cursor-pointer",
										isProfileActive && "bg-accent text-accent-foreground",
									)}
									onClick={() => navigate("/settings/profile")}
								>
									<span className="text-sm">Profile</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>

					{/* Admin Section */}
					{isOwnerOrAdmin() && (
						<SidebarGroup className="p-2">
							<SidebarGroupLabel className="px-2 h-8 text-xs text-muted-foreground">
								Admin
							</SidebarGroupLabel>

							<SidebarMenu>
								{/* Users */}
								<SidebarMenuItem>
									<SidebarMenuButton
										className={cn(
											"p-2 h-8 rounded-md cursor-pointer",
											isUsersActive && "bg-accent text-accent-foreground",
										)}
										onClick={() => navigate("/settings/users")}
									>
										<span className="text-sm">Users</span>
									</SidebarMenuButton>
								</SidebarMenuItem>

								{/* Connection Sources (Collapsible) */}
								<SidebarMenuItem>
									<SidebarMenuButton
										className="p-2 h-8 rounded-md cursor-pointer flex items-center gap-2"
										onClick={() => setConnectionSourcesOpen(!connectionSourcesOpen)}
									>
										<ChevronRight
											className={cn(
												"h-4 w-4 transition-transform",
												connectionSourcesOpen && "rotate-90"
											)}
										/>
										<span className="text-sm flex-1">Connection Sources</span>
									</SidebarMenuButton>

									{connectionSourcesOpen && (
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton
													className={cn(
														"h-7 px-2 rounded-md cursor-pointer",
														isKnowledgeSourcesActive && !isItsmSourcesActive && "bg-accent text-accent-foreground",
													)}
													onClick={() => navigate("/settings/connections")}
												>
													<span className="text-sm">Knowledge Sources</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton
													className={cn(
														"h-7 px-2 rounded-md cursor-pointer",
														isItsmSourcesActive && "bg-accent text-accent-foreground",
													)}
													onClick={() => navigate("/settings/itsm")}
												>
													<span className="text-sm">ITSM Sources</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									)}
								</SidebarMenuItem>

								{/* Plan & Billing */}
								<SidebarMenuItem>
									<SidebarMenuButton
										className="p-2 h-8 rounded-md cursor-pointer"
										onClick={() => navigate("/settings/billing")}
									>
										<span className="text-sm">Plan & Billing</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					)}
				</SidebarContent>
			</Sidebar>

			<SidebarInset className="flex flex-col w-full">
				<main className="w-full p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
