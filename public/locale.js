const translationMsg = {
	en: {
		WhatsAppSystemCancelMsg:
			"Sorry, the {0} branch where you have scheduled your appointment on {1} at {2} for {3} service is temporarily closed. Do you want to schedule your appointment at another branch? Appointment Number {4}",
		IssueAppointmentInternalServerError: "Internal Server Error",
		IssueAppointmentSomethingWentWrong: "Something went wrong",
		IssueAppointmentAppointmentBookedSuccessfully:
			"Appointment booked successfully",

		IssueAppointmentHasAppointment: "You already have an appointment.",
		IssueAppointmentInvalidParameters:
			"Unauthorized access, Enter email id or mobile number first to perform this action.",
		GetApptCategoriesInvalidParameters: "Invalid Parameter",
		GetTicketCategoriesInvalidParameters: "Invalid Parameter",
		GetApptCategoriesDataFetched: "Data successfully fetched",
		GetTicketCategoriesDataFetched: "Data successfully fetched",
		GetApptCategoriesNotFound: "No data found.",
		GetTicketCategoriesNotFound: "No data found.",
		GetApptCategoriesInternalServerError:
			"An error occurred while fetching data",
		GetTicketCategoriesInternalServerError:
			"An error occurred while fetching data",
		GetApptCategoriesNotFoundFromBranchCode: "Branch not found",
		GetAllDaysSlotsOfBranchInvalidParameters: "Invalid parameters",
		GetAllDaysSlotsOfBranchNoFutureSlots: "No available slots in the future",
		GetAllDaysSlotsOfBranchDataFetched: "Data successfully fetched",
		GetAllDaysSlotsOfBranchNotFound: "No data found.",
		GetAllDaysSlotsOfBranchInternalServerError:
			"An error occurred while fetching data",
		GetDisabledDatesInvalidParameters: "Invalid parameters",
		GetDisabledDatesDataFetched: "Data successfully fetched",
		GetDisabledDatesNotFound: "No data found.",
		GetDisabledDatesInternalServerError:
			"An error occurred while fetching data",
		GetSlotDetailInvalidParameters: "Invalid parameters",
		GetSlotDetailDataFetched: "Data successfully fetched",
		GetSlotDetailNotFound: "No data found.",
		GetSlotDetailInternalServerError: "An error occurred while fetching data",
		GetNearestBranchesInvalidParameters: "Invalid parameters",
		GetNearestBranchesDataFetched: "Data successfully fetched",
		GetNearestBranchesNotFound: "Branch not found",
		GetNearestBranchesNotFoundFromBranchCode: "Branch not found",
		GetNearestBranchesInternalServerError:
			"An error occurred while fetching data",
		GetBranchListDataFetched: "Data successfully fetched",
		GetBranchListNotFound: "Branch not found",
		GetBranchListNotFoundFromBranchCode: "Branch not found",
		GetBranchListInternalServerError: "An error occurred while fetching data",
		GetBranchListByCategoryInvalidParameters: "Invalid parameters",
		GetBranchListByCategoryDataFetched: "Data successfully fetched",
		GetBranchListByCategoryNotFound: "Branch not found",
		GetBranchListByCategoryNotFoundFromBranchCode: "Branch not found",
		GetBranchListByCategoryInternalServerError:
			"An error occurred while fetching data",
		GetticketJourneyInvalidParameters:
			"Branch ID and Ticket Number are required.",
		CancelAppointmentInvalidParameters: "Invalid parameters",
		CancelAppointmentInternalServerError: "An internal server error occurred.",
		CancelAppointmentNotFound: "Appointment not found!",
		CancelAppointmentFailure: "Appointment not cancel!",
		CancelAppointmentFailurePermitted: "Changes to this appointment are no longer permitted.",
		CancelAppointmentSuccess: "Appointment cancel successfully!",

		VerifyAppointmentInvalidParameters: "Invalid parameters",
		VerifyAppointmentInternalServerError: "An internal server error occurred.",
		VerifyAppointmentNotFound: "No appointment found!",
		VerifyAppointmentSuccess: "Data fetched successfully!",
		VerifyAppointmentUserOutOfRange: "You are outside the service area. Please visit the branch to check your appointment.",
		RescheduleAppointmentTicketInvalidParameters: "Invalid parameters",
		RescheduleAppointmentTicketFailedToCancel:
			"Failed to cancel the previous appointment",
		RescheduleAppointmentTicketSuccess:
			"Rescheduling the appointment succeeded",
		RescheduleAppointmentInternalServerError: "Internal Server Error",
		RescheduleAppointmentSomethingWentWrong: "Something went wrong",
		AppointmentServedInvalidParameters: "Invalid parameters",
		UpdateAppointmentStatusInvalidParameters: "Invalid parameters",
		UpdateAppointmentStatusDataSuccess: "Data updated successfully!",
		UpdateAppointmentStatusInternalServerError:
			"An error occurred while updating data",
		UpdateAppointmentStatusSomethingWentWrong: "Something went wrong",
		GenerateOTPAppointmentNotFound: "Invalid Details",
		GenerateOTPInvalidParamters: "Invalid Details",
		GenerateOTPSuccess: "OTP generated successfully",
		GenerateOTPInternalServerError: "An error occurred while generating OTP",
		ValidateOTPInvalidParameters:
			"Invalid parameters, Email or phoneNumber is required",
		ValidateOTPSuccess: "Valid OTP",
		ValidateOTPBadRequest: "Invalid or expired OTP / Parameters",
		ValidateOTPInternalServerError: "An error occurred while validating OTP",
		maxQuota: "max quota for the slot has been reached.",
		NewAppointmentFoundAgainstTheCustomer: "",
		ICSFileSub: "Confirmation appointment project in {{branch_title}}",
		ICSFileDesciption: "Confirmation of Appointment at {{branch_title}}",
		AppointmentRescheduleSuccessMsg: "Appointment Reschedule Successfully",
		GenerateTokenInvalidParameters:
			"sId field is required to generate the token!",
		GenerateTokenInvalidGUID: "Invalid GU ID!",
		GenerateTokenClientIdNotFound: "sId not found!",
		GenerateTokenSuccess: "Token generated successfully",
		GenerateTokenInternalServerError:
			"An error occurred while generating token",
		VerifyJWTMissingSID: "sId field is required to verify the token!",
		VerifyJWTInvalidGUID: "Invalid GU ID!",
		VerifyJWTClientIdNotFound: "sId not found!",
		VerifyJWTNoToken: "A token is required for authentication",
		VerifyJWTInvalidToken: "Invalid Token!",
		VerifyJWTInternalServerError: "An error occurred while verifying token",
		CannotBookonBackDateandTime:
			"Cannot Book Appointment on Back date or time slots",

		//ticketing
		GetBranchIdInvalidParameters: "Invalid Parameter",
		GetBranchIdDataFetched: "Data successfully fetched",
		GetBranchIdInternalServerError: "An internal server error occurred.",
		GetBranchIdNotFound: "Branch not found",
		TicketIssueInvalidParameters: "Invalid Parameter",
		TicketIssueBranchIsClosed: "Branch is closed",
		TicketIssueBranchHoliday: "Branch is closed",
		TicketIssueWorkFlowNotExist: "Workflow does not exist",
		TicketIssueTicketNotFound: "Ticket not found",
		TicketIssueActivityNotFound: "Activity not found",
		TicketIssueCategoryNotFound: "Category not found",
		TicketIssueBranchNotFound: "Branch not found",
		TicketIssueSuccess: "Ticket Successfully Issued.",
		TicketIssueInternalServerError: "An error occurred while issuing ticket",
		TicketIssueSomethingWentWrong: "Something went wrong",
		TicketIssueRequestAlreadyProcessed: "Request has been already processed",
		GetRabbitMQIPInvalidParameters: "Invalid Parameter",
		GetRabbitMQIPNotFound: "Branch does not exist",
		GetRabbitMQIPInternalServerError: "An error occurred while fetching data",
		GetRabbitMQIPSuccess: "Branch RabbitMQ IP fetched successfully",
		GetWaitingTicketDataInvalidParameters: "Invalid Parameter",
		GetWaitingTicketDataSuccess: "Data successfully fetched",
		GetWaitingTicketDataInvalidParameters: "Invalid parameters",
		GetWaitingTicketDataInternalError: "Something went wrong",
		GetWaitingTicketDataNotFound: "Waiting Ticket List not found.",
		GetOperatorRoleFromBranchIdInvalidParameters: "Invalid parameters",
		GetOperatorRoleFromBranchIdSuccess: "Operator role fetched successfully",
		GetOperatorRoleFromBranchIdNotFound: "Operator role not found.",
		GetOperatorRoleFromBranchIdInternalError:
			"An error occurred while fetching data",
		OpenCounterInvalidParameters: "Invalid Parameter",
		OpenCounterSuccess: "Counter opened successfully",
		OpenCounterInternalServerError: "An error occurred while opening counter",
		OpenCounterRequestAlreadyProcessed: "Request has been already processed",
		OpenCounterDataFailure: "Something went wrong",
		OpenCounterBranchDataFailure: "Something went wrong",

		CloseCounterInvalidParameters: "Invalid Parameter",
		CloseCounterSuccess: "Counter closed successfully",
		CloseCounterInternalServerError: "An error occurred while closing counter",
		CloseCounterRequestAlreadyProcessed: "Request has been already processed",
		CloseCounterDataFailure: "Something went wrong",
		CloseCounterBranchDataFailure: "Something went wrong",

		GetCategoryWaitingListInvalidParameters: "Invalid Parameter",
		GetCategoryWaitingListSuccess: "Data successfully fetched",
		GetCategoryWaitingListInternalServerError:
			"An error occurred while fetching data",
		GetCategoryWaitingListRequestAlreadyProcessed:
			"Request has been already processed",
		GetCategoryWaitingListDataFailure: "Something went wrong",
		GetCategoryWaitingListBranchDataFailure: "Something went wrong",

		NoShowTicketInvalidParameters: "Invalid Parameter",
		NoShowTicketSuccess: "Ticket Successfully marked no-show",
		NoShowTicketInternalServerError: "An error occurred while marking no-show",
		NoShowTicketRequestAlreadyProcessed: "Request has been already processed",
		NoShowTicketDataFailure: "Something went wrong",
		NoShowTicketBranchDataFailure: "Something went wrong",

		PostProcessingTicketInvalidParameters: "Invalid Parameter",
		PostProcessingTicketSuccess: "Ticket Successfully marked post-processing",
		PostProcessingTicketInternalServerError:
			"An error occurred while marking post-processing",
		PostProcessingTicketRequestAlreadyProcessed:
			"Request has been already processed",
		PostProcessingTicketDataFailure: "Something went wrong",
		PostProcessingTicketBranchDataFailure: "Something went wrong",

		SetProfileIdInvalidParameters: "Invalid Parameter",
		SetProfileIdSuccess: "Profile Successfully set",
		SetProfileIdInternalServerError:
			"An error occurred while marking setting up profile",
		SetProfileIdRequestAlreadyProcessed: "Request has been already processed",
		SetProfileIdDataFailure: "Something went wrong",
		SetProfileIdBranchDataFailure: "Something went wrong",

		AddMatterTicketInvalidParameters: "Invalid Parameter",
		AddMatterTicketSuccess: "Matter code Successfully added",
		AddMatterTicketInternalServerError:
			"An error occurred while adding up matter code",
		AddMatterTicketRequestAlreadyProcessed:
			"Request has been already processed",
		AddMatterTicketDataFailure: "Something went wrong",
		AddMatterTicketBranchDataFailure: "Something went wrong",

		RandomCallTicketInvalidParameters: "Invalid Parameter",
		RandomCallTicketSuccess: "Random ticket Successfully called",
		RandomCallTicketInternalServerError:
			"An error occurred while adding up random calling",
		RandomCallTicketRequestAlreadyProcessed:
			"Request has been already processed",
		RandomCallTicketDataFailure: "Something went wrong",
		RandomCallTicketBranchDataFailure: "Something went wrong",
		RandomCallTicketTicketNotFound: "Ticket not found",

		GetCounterInfoInvalidParameters: "Invalid Parameter",
		GetCounterInfoSuccess: "Data sent successfully",
		GetCounterInfoInternalServerError: "An error occurred while fetching data",
		GetCounterInfoRequestAlreadyProcessed: "Request has been already processed",
		GetCounterInfoDataFailure: "Something went wrong",
		GetCounterInfoBranchDataFailure: "Something went wrong",

		IssueTicketWithJourneyInvalidParameters: "Invalid Parameter",
		IssueTicketWithJourneySuccess: "Ticket Successfully Issued.",
		IssueTicketWithJourneyInternalServerError:
			"An error occurred while issuing ticket",
		IssueTicketWithJourneyRequestAlreadyProcessed:
			"Request has been already processed",
		IssueTicketWithJourneyDataFailure: "Something went wrong",
		IssueTicketWithJourneyBranchDataFailure: "Something went wrong",
		IssueTicketWithJourneyCustomerHaveTicket:
			"Customer have already issued ticket",

		EditTicketInvalidParameters: "Invalid Parameter",
		EditTicketSuccess: "Ticket edit successfully",
		EditTicketInternalServerError: "An error occurred while editing ticket",
		EditTicketRequestAlreadyProcessed: "Request has been already processed",
		EditTicketDataFailure: "Something went wrong",
		EditTicketBranchDataFailure: "Something went wrong",

		GetCategoriesInvalidParameters: "Invalid Parameter",
		GetCategoriesDataNotFound: "Data not found",
		GetCategoriesSuccess: "Data sent successfully",
		GetCategoriesInternalServerError: "An error occurred while fetching data",

		TransferCategoryTicketInvalidParameters: "Invalid Parameter",
		TransferCategoryTicketSuccess: "Transfer Ticket successfully",
		TransferCategoryTicketInternalServerError:
			"An error occurred while ticket transfer",
		TransferCategoryTicketRequestAlreadyProcessed:
			"Request has been already processed",
		TransferCategoryTicketDataFailure: "Something went wrong",
		TransferCategoryTicketBranchDataFailure: "Something went wrong",

		TransferBulkTicketInvalidParameters: "Invalid Parameter",
		TransferBulkTicketSuccess: "Bulk Tickets Transferred successfully",
		TransferBulkTicketInternalServerError:
			"An error occurred while transfering the bulk ticket",
		TransferBulkTicketRequestAlreadyProcessed:
			"Request has been already processed",
		TransferBulkTicketDataFailure: "Something went wrong",
		TransferBulkTicketBranchDataFailure: "Something went wrong",

		CallTicketTicketInvalidParameters: "Invalid Parameter",
		CallTicketTicketSuccess: "Ticket called successfully",
		CallTicketTicketInternalServerError:
			"An error occurred while calling the ticket",
		CallTicketTicketRequestAlreadyProcessed:
			"Request has been already processed",
		CallTicketTicketDataFailure: "Something went wrong",
		CallTicketTicketBranchDataFailure: "Something went wrong",

		ServeTicketInvalidParameters: "Invalid Parameter",
		ServeTicketSuccess: "Ticket Served successfully",
		ServeTicketInternalServerError:
			"An error occurred while serving the ticket",
		ServeTicketRequestAlreadyProcessed: "Request has been already processed",
		ServeTicketDataFailure: "Something went wrong",
		ServeTicketBranchDataFailure: "Something went wrong",

		WaitTicketInvalidParameters: "Invalid Parameter",
		WaitTicketSuccess: "Ticket waited successfully",
		WaitTicketInternalServerError:
			"An error occurred while marking the ticket on wait",
		WaitTicketRequestAlreadyProcessed: "Request has been already processed",
		WaitTicketDataFailure: "Something went wrong",
		WaitTicketBranchDataFailure: "Something went wrong",

		RecallTicketInvalidParameters: "Invalid Parameter",
		RecallTicketSuccess: "Ticket recalled successfully",
		RecallTicketInternalServerError:
			"An error occurred while recalling the ticket",
		RecallTicketRequestAlreadyProcessed: "Request has been already processed",
		RecallTicketDataFailure: "Something went wrong",
		RecallTicketBranchDataFailure: "Something went wrong",

		ActiveCountersDataInvalidParameters: "Invalid Parameter",
		ActiveCountersDataSuccess: "Active counters successfully fetched",
		ActiveCountersDataInternalServerError:
			"An error occurred while fecthing active counters",
		ActiveCountersDataRequestAlreadyProcessed:
			"Request has been already processed",
		ActiveCountersDataDataFailure: "Something went wrong",
		ActiveCountersDataBranchDataFailure: "Something went wrong",

		CancelTicketInvalidParameters: "Invalid Parameter",
		CancelTicketSuccess: "Ticket cancelled successfully",
		CancelTicketInternalServerError:
			"An error occurred while cancelling the ticket",
		CancelTicketRequestAlreadyProcessed: "Request has been already processed",
		CancelTicketDataFailure: "Something went wrong",
		CancelTicketBranchDataFailure: "Something went wrong",
		BranchisClosed: "Branch is closed",
		TicketNotFound: "Ticket not found",
		CategoryNotFound: "Category not found",
		WorkFlowNotExist: "Workflow does not exist",
		InternalServerError: "Internal server error",
		InternalServerError: "Internal server error",

		Unknown: "Unknown error",
		SystemTooMuchStress: "The system is under too much stress",
		MessageInvalid: "Invalid message",
		DeviceUnauthorized: "Device is unauthorized",
		UserUnauthorized: "User is unauthorized",
		UserAlreadyLoggedInOtherCounter:
			"User already logged in from another counter",
		MaxTSULoggedIn: "Maximum number of TSU logged in",
		CategoryNotFound: "Category not found",
		WorkFlowNotExist: "Workflow does not exist",
		WorkflowCompleted: "Workflow completed",
		UndefinedCategoryInSequence: "Undefined category in sequence",
		PoolNotDefined: "Pool not defined",
		UnknownException: "Unknown exception",
		CounterNotFound: "Counter not found",
		CounterProfileNotSet: "Counter profile not set",
		CounterOpenedByOtherUser: "Counter opened by another user",
		CounterAlreadyOpened: "Counter already opened",
		CounterAlreadyClosed: "Counter already closed",
		CounterNotOpened: "Counter not opened",
		CounterTicketsInLocalWait: "Tickets are in local wait",
		ActivityNotFound: "Activity not found",
		ActivityNotStarted: "Activity not started",
		TicketAlreadyCancelled: "Ticket already cancelled",
		TicketNotFound: "Ticket not found",
		TicketMatterRequired: "Ticket matter required",
		TicketMatterAlreadySelected: "Ticket matter already selected",
		TicketNoShowMatterSelected: "No show not allowed for selected matter",
		TicketInvalidTransferRequest: "Invalid transfer request for ticket",
		NoTicketFound: "No ticket found",
		TicketInvalidTransferTarget: "Invalid transfer target for ticket",
		UnknownStateTransition: "Unknown state transition",
		UnknownStateTransitionCounter: "Unknown state transition at counter",
		UnknownStateTransitionUser: "Unknown state transition for user",
		BranchIsClosed: "Branch is closed",
		BranchIsClosing: "Branch is closing",
		SystemIsInitializing: "System is initializing",
		PasswordNotEntered: "Password not entered",
		CredentialsNotEntered: "Credentials not entered",
		RandomCallLimitExceeded: "Random call limit exceeded",
		PushbackIndexNotEnabled: "Pushback index is not enabled",
		EmailSubjectTemplateOTP: "OTP",
		EmailMsgTemplateOTP: "Email Your OTP is {otp}",
		SmsMsgTemplateOTP: "SMS Your OTP is {otp}",
		REPRINT_TEMPLATE_MSG:
			"Dear Guest, Your Waiting No is {0}. Patient Number {1}",
		virtualAppointmentEventSummary: "Virtual Appointment",
		virtualAppointmentLocation: "Online",
		virtualAppointmentDescription: "Virtual Appointment Meeting",
		GetProductTypesInvalidParameters: "Invalid Parameter",
		GetProductTypesDataFetched: "Data successfully fetched",
		GetProductTypesNotFound: "No data found.",
		GetProductTypesInternalServerError: "An error occurred while fetching data",
		GetgetProductFamiliesInvalidParameters: "Invalid Parameter",
		GetProductFamiliesDataFetched: "Data successfully fetched",
		GetTicketJourneyDataFetched: "Data successfully fetched",
		GetProductFamiliesNotFound: "No data found.",
		GetProductFamiliesInternalServerError:
			"An error occurred while fetching data",
		GetPhoneModelsInvalidParameters: "Invalid Parameter",
		GetPhoneModelsDataFetched: "Data successfully fetched",
		GetPhoneModelsNotFound: "No data found.",
		GetPhoneModelsInternalServerError: "An error occurred while fetching data",
		BranchEvolutionInvalidParameters: "Invalid Parameter",
		BranchEvolutionDataFetched: "Data successfully fetched",
		BranchEvolutionNotFound: "No data found.",
		BranchEvolutionInternalServerError: "An error occurred while fetching data",
		BranchTicketInfoInvalidParameters: "Invalid Parameter",
		BranchTicketInfoDataFetched: "Data successfully fetched",
		BranchTicketInfoNotFound: "No data found.",
		BranchTicketInfoInternalServerError:
			"An error occurred while fetching data",
		TicketTrackingSummaryInvalidParameters: "Invalid Parameter",
		TicketTrackingSummaryDataFetched: "Data successfully fetched",
		TicketTrackingSummaryNotFound: "No data found.",
		TicketTrackingSummaryInternalServerError:
			"An error occurred while fetching data",
		GENERATEOTPPLEASEPROVIDEAPPTNO: "Please Provide Appointment Number",
		DesiredSlotErrorForDuplicateRecord: "Data is already saved",
		DesiredSlotGenericError: "Something went wrong",
		saveDesireSlotSuccessMessage:
			"Your desire time slot details have been successfully submitted",
		GetAppointmentDataFetched: "Data successfully fetched",
		GetAppointmentInvalidParameters: "Invalid Parameter",
		GetAppointmentInternalServerError: "An error occurred while fetching data",

		CancelBulkAppointmentInvalidParameters: "Invalid parameters",
		CancelBulkAppointmentInternalServerError:
			"An internal server error occurred.",
		CancelBulkAppointmentNotFound: "Appointment not found!",
		CancelBulkAppointmentFailure: "Appointment not cancel!",
		CancelBulkAppointmentFailureState5:
			"Can't cancel the appointment. You have a ticket issued. Please wait for your turn.",
		CancelBulkAppointmentFailureState6:
			"You have already been served. Thanks for visiting us.",
		CancelBulkAppointmentFailureState2:
			"You have already canceled your appointment.",
		CancelBulkAppointmentFailureState12_4: "Your appointment has expired.",
		CancelBulkAppointmentFailureState7_8:
			"You have not responded to your ticket call for a long time. Your ticket has been canceled by system automatically.",
		CancelBulkAppointmentFailureStateDefault:
			"Appointment info not valid to cancel.",
		CancelBulkAppointmentFailureStateBackDate:
			"You are cancelling back date appointment",
		CancelBulkAppointmentSuccess: "Appointment cancel successfully!",
		CancelStatusSuccess: "Cancelled",
		CancelStatusFailure: "Failed",
		GetCustomersInvalidParameters: "Invalid Parameter",
		GetCustomersDataFetched: "Data successfully fetched",
		GetCustomersDataFetchedCustomerHaveTicket:
			"Customer have already issued ticket",
		GetCustomersNotFound: "No data found.",
		GetCustomersInternalServerError: "An error occurred while fetching data",
		GetCustomerListInvalidParameters: "Invalid Parameter",
		GetCustomerListDataFetched: "Data successfully fetched",
		GetCustomerListNotFound: "No data found.",
		GetCustomerListInternalServerError: "An error occurred while fetching data",
		InsertCustomerVisitInvalidParameters: "Invalid Parameter",
		InsertCustomerVisitDataFetched: "Data successfully fetched",
		InsertCustomerVisitDuplicateEntry:
			"A customer visit with the same ticket ID and customer ID already exists.",
		InsertCustomerVisitInternalServerError:
			"An error occurred while fetching data",
		CheckCustomerVisitInvalidParameters: "Invalid Parameter",
		CheckCustomerVisitDataFetched: "Data successfully fetched",
		CheckCustomerVisitNoEntry: "No entry found in customer visit.",
		CheckCustomerVisitInternalServerError:
			"An error occurred while fetching data",

		GetClientRegionInvalidParameters: "Invalid Parameter",
		GetClientRegionDataFetched: "Data successfully fetched",
		GetClientRegionNotFound: "No data found.",
		GetClientRegionInternalServerError: "An error occurred while fetching data",
		ShareCustomerInfoInvalidParameters: "Invalid Parameter",
		ShareCustomerInfoDataFetched: "Data successfully fetched",
		ShareCustomerInfoNotFound: "No data found.",
		ShareCustomerInfoInternalServerError:
			"An error occurred while fetching data",
		AddCustomerSuccess: "Customer added successfully",
		AddCustomerCustomerExists:
			"Customer already exists against the following fields: {{matchedConditions}}",
		AddCustomerFailure: "Failed to add customer",
		AddCustomerInvalidParameters: "Invalid parameters",
		AddCustomerInternalServerError: "An error occurred",
		UpdateCustomerInvalidParameters: "Invalid parameters",
		UpdateCustomerSuccess: "Customer updated successfully",
		UpdateCustomerFailure: "Failed to update customer",
		UpdateCustomerInternalServerError: "An error occurred",
		UpdateCustomerNotFound: "Customer does not exist.",
		UpdateCustomerModifyClientID: "Client ID cannot be modified.",
		UpdateCustomerModifyRegionID: "Region ID cannot be modified.",
		UpdateCustomerModifyID: "Customer ID cannot be modified.",
		UpdateCustomerModifyCustomerID: "Customer ID cannot be modified.",
		getTicketDetailTicketFoundSuccessfully:
			"Ticket Detail Fetched Successfully",
		getTicketDetailSomethingWentWrong:
			"Something went wrong Please try again..",
		getTicketDetailTicketNotFound: "Ticket not found",

		GetTicketDetailByTicketNumberDataFetched:
			"Ticket Detail Fetched Successfully",
		GetTicketDetailByTicketNumberSomethingWentWrong:
			"Something went wrong Please try again..",
		GetTicketDetailByTicketNumberNotFound: "Ticket not found",
		GetTicketDetailByTicketNumberInvalidParameters: "Invalid parameters",
		GetTicketDetailByTicketNumberInternalServerError: "An error occurred",

		UpdateReissueStatusNumberDataFetched: "Ticket Detail Fetched Successfully",
		UpdateReissueStatusNumberSomethingWentWrong:
			"Something went wrong Please try again..",
		UpdateReissueStatusNumberNotFound: "Ticket not found",
		UpdateReissueStatusNumberInvalidParameters: "Invalid parameters",
		UpdateReissueStatusNumberInternalServerError: "An error occurred",
		UserBranchTransferInvalidParameters: "Invalid Parameter",
		UserBranchTransferSuccess: "Branch transfer completed successfully",
		UserBranchTransferInternalServerError:
			"An error occurred while processing the branch transfer",
		UserBranchTransferRequestAlreadyProcessed:
			"Request has been already processed",
		UserBranchTransferDataFailure: "Something went wrong",
		UserBranchTransferBranchDataFailure: "Something went wrong",
		GetEngineConfigurationInvalidParameters: "Invalid Parameter",
		GetEngineConfigurationSuccess: "Engine Configuration fetched successfully",
		GetEngineConfigurationInternalServerError:
			"An error occurred while processing the engine configuration",
		GetEngineConfigurationRequestAlreadyProcessed:
			"Request has been already processed",
		GetEngineConfigurationDataFailure: "Something went wrong",
		GetEngineConfigurationBranchDataFailure: "Something went wrong",
		UserFound: "User Found.",
		UserFoundAnotherBranch: "User Found on another branch.",
		UserAreadyLoggedInOnOtherCounter:
			"User is already logged-in from another counter",
		UsernamePasswordInvalid: "Invalid username or password",
		HeartbeatSyncExecution: "Sync in Progress",
		QuotaWaitTimeReachedClosingTime:
			"Customer may not be served before closing time.",
		QuotaWaitTimeReached: "Average wait time exceeds the limit.",
		GetBranchIPInvalidParameters: "Invalid Parameter",
		GetBranchIPNotFound: "Branch does not exist",
		GetBranchIPInternalServerError: "An error occurred while fetching data",
		GetBranchIPSuccess: "Branch IP fetched successfully",
		SilentRandomCallTicketInvalidParameters: "Invalid Parameter",
		SilentRandomCallTicketSuccess: "Ticket successfully called",
		SilentRandomCallTicketInternalServerError:
			"An error occurred while processing the Silent Random Call Ticket",
		SilentRandomCallTicketRequestAlreadyProcessed:
			"Request has been already processed",
		SilentRandomCallTicketDataFailure: "Something went wrong",
		SilentRandomCallTicketBranchDataFailure: "Something went wrong",
		newAppointment: "NEW_APPOINTMENT",
		cancelledAppointment: "CANCELLED_APPOINMENT",
		rescheduledAppointment: "RESCHEDULED_APPOINMENT",
		implicityCancelledAppointment: "IMPLICITLY_CANCELLED_APPOINMENT",
		RescheduleCancelAppointmentFailure:
			"We couldn’t reschedule your appointment because it’s no longer active. Please book a new appointment",
		minLengthValidationError:
			"{{fieldName}} must be at least {{minLength}} characters long.",
		fieldValidationFailed: "Please provide valid Information",
		TicketSetPriorityInvalidParameters: "Invalid Parameter",
		TicketSetPrioritySuccess: "Ticket priority successfully updated",
		TicketSetPriorityInternalServerError:
			"An error occurred while updating ticket priority",
		TicketSetPriorityRequestAlreadyProcessed:
			"Request has been already processed",
		TicketSetPriorityDataFailure: "Something went wrong",
		TicketSetPriorityBranchDataFailure: "Something went wrong",

		GetBranchCountersDataInvalidParameters: "Invalid Parameter",
		GetBranchCountersDataSuccess: "Branch counters data successfully fetched",
		GetBranchCountersDataInternalServerError:
			"An error occurred while fetching branch counters data",
		GetBranchCountersDataRequestAlreadyProcessed:
			"Request has been already processed",
		GetBranchCountersDataFailure: "Something went wrong",
		GetBranchCountersDataBranchDataFailure: "Something went wrong",
		GetBranchCountersDataNotFound: "No data found",

		GetBranchCountersInvalidParameters: "Invalid Parameter",
		GetBranchCountersSuccess: "Branch counters successfully fetched",
		GetBranchCountersInternalServerError:
			"An error occurred while fetching branch counters",
		GetBranchCountersRequestAlreadyProcessed:
			"Request has been already processed",
		GetBranchCountersDataFailure: "Something went wrong",
		GetBranchCountersBranchDataFailure: "Something went wrong",
		GetBranchCountersNotFound: "No data found",

		CounterStartActivityInvalidParameters: "Invalid Parameter",
		CounterStartActivitySuccess: "Counter activity successfully started",
		CounterStartActivityInternalServerError:
			"An error occurred while starting counter activity",
		CounterStartActivityRequestAlreadyProcessed:
			"Request has been already processed",
		CounterStartActivityDataFailure: "Something went wrong",
		CounterStartActivityBranchDataFailure: "Something went wrong",

		CounterEndActivityInvalidParameters: "Invalid Parameter",
		CounterEndActivitySuccess: "Counter activity successfully ended",
		CounterEndActivityInternalServerError:
			"An error occurred while ending counter activity",
		CounterEndActivityRequestAlreadyProcessed:
			"Request has been already processed",
		CounterEndActivityDataFailure: "Something went wrong",
		CounterEndActivityBranchDataFailure: "Something went wrong",
		GetBranchServesDataInvalidParameters: "Invalid Parameter",
		GetBranchServesDataSuccess: "Branch serve data successfully fetched",
		GetBranchServesDataInternalServerError:
			"An error occurred while ending fetching branch serve data",
		GetBranchServesDataRequestAlreadyProcessed:
			"Request has been already processed",
		GetBranchServesDataDataFailure: "Something went wrong",
		GetBranchServesDataBranchDataFailure: "Something went wrong",
		GetBranchServesDataNotFound: "No data found",
		RepeatCallTicketInvalidParameters: "Invalid Parameter",
		RepeatCallTicketSuccess: "Repeat ticket successfully called",
		RepeatCallTicketInternalServerError:
			"An error occurred while ending calling repeat ticket",
		RepeatCallTicketRequestAlreadyProcessed:
			"Request has been already processed",
		RepeatCallTicketDataFailure: "Something went wrong",
		RepeatCallTicketBranchDataFailure: "Something went wrong",
		FetchConfigurationInvalidParameters: "Invalid Parameter",
		FetchConfigurationSuccess: "Configuration successfully fetched",
		FetchConfigurationInternalServerError:
			"An error occurred while ending fetching configuration",
		FetchConfigurationRequestAlreadyProcessed:
			"Request has been already processed",
		FetchConfigurationDataFailure: "Something went wrong",
		FetchConfigurationBranchDataFailure: "Something went wrong",
		GetCounterListInvalidParameters: "Invalid Parameter",
		GetCounterListSuccess: "Counter list successfully fetched",
		GetCounterListInternalServerError:
			"An error occurred while fetching counter list",
		GetCounterListRequestAlreadyProcessed: "Request has been already processed",
		GetCounterListDataFailure: "Something went wrong",
		GetCounterListBranchDataFailure: "Something went wrong",

		GetTicketAgainstPayloadInvalidParameters: "Invalid Parameter",
		GetTicketAgainstPayloadSuccess: "Ticket successfully fetched",
		GetTicketAgainstPayloadInternalServerError:
			"An error occurred while fetching ticket against payload",
		GetTicketAgainstPayloadRequestAlreadyProcessed:
			"Request has been already processed",
		GetTicketAgainstPayloadDataFailure: "Something went wrong",
		GetTicketAgainstPayloadBranchDataFailure: "Something went wrong",
		GetTicketAgainstPayloadNotFound: "No data found",
		GetBranchCancelDataInvalidParameters: "Invalid Parameter",
		GetBranchCancelDataSuccess: "Branch cancel data successfully fetched",
		GetBranchCancelDataInternalServerError:
			"An error occurred while ending fetching branch cancel data",
		GetBranchCancelDataRequestAlreadyProcessed:
			"Request has been already processed",
		GetBranchCancelDataDataFailure: "Something went wrong",
		GetBranchCancelDataBranchDataFailure: "Something went wrong",
		GetBranchCancelDataNotFound: "No data found",
		StartServingTicketInvalidParameters: "Invalid Parameter",
		StartServingTicketInvalidParameters: "Invalid Parameter",
		StartServingTicketSuccess: "Ticket Successfully started serving ticket",
		StartServingTicketInternalServerError:
			"An error occurred while starting serving ticket",
		StartServingTicketRequestAlreadyProcessed:
			"Request has been already processed",
		StartServingTicketDataFailure: "Something went wrong",
		StartServingTicketBranchDataFailure: "Something went wrong",
		BranchNotFoundOrInactive: "Branch not found or inactive",
		changeAppointmentStatusInternalServerError:
			"Something went wrong while updating appointment state.",
		changeAppointmentStatusEndpointMissingRequiredFields:
			"Missing Required Field",
		changeAppointmentStatusEndpointDataSuccess:
			"Appointment status updated successfully!",
		changeAppointmentStatusEndpointAppointmentNotFound:
			"No Active appointment record found or no update required.",
		changeAppointmentStatusCannotSetAppointmentToActiveState:
			"The selected appointment state change is not allowed.",
		CheckUserWithinBranchRadiusInvalidParameters: "Invalid request",
		CheckUserWithinBranchRadiusWithinRange: "Access granted",
		CheckUserWithinBranchRadiusOutOfRange: "Access denied",
		CheckUserWithinBranchRadiusInternalServerError: "Service unavailable",
		ChangeLanguageTicketInvalidParameters: "Invalid Parameter",
		ChangeLanguageTicketSuccess: "Language changed successfully",
		ChangeLanguageTicketInternalServerError: "An error occurred while changing language",
		ChangeLanguageTicketRequestAlreadyProcessed: "Request has been already processed",
		ChangeLanguageTicketDataFailure: "Something went wrong",
		ChangeLanguageTicketBranchDataFailure: "Branch Does not exist",
		ChangeLanguageTicketLanguageNotFound: "Language not found",
		ProcessCustomerAppointmentDataInvalidParameters: "Invalid Parameter",
		ProcessCustomerAppointmentDataSuccess: "Appointment data processed successfully",
		ProcessCustomerAppointmentDataNotFound: "No appointment data found for this customer",
		ProcessCustomerAppointmentDataInternalServerError: "An error occurred while processing appointment data",
	},
	sp: {
		WhatsAppSystemCancelMsg:
			"Lo siento, la sucursal {0} donde ha programado su cita para el {1} a las {2} para el servicio {3} está temporalmente cerrada. ¿Quiere programar su cita en otra sucursal? Número de cita {4}",
		IssueAppointmentInternalServerError:
			"Se produjo un error al obtener los datos",
		IssueAppointmentSomethingWentWrong: "Algo salió mal",
		IssueAppointmentAppointmentBookedSuccessfully: "Cita reservada con éxito",
		IssueAppointmentHasAppointment: "Ya tienes una cita.",
		IssueAppointmentInvalidParameters:
			"Acceso no autorizado, primero ingrese el ID de correo electrónico o el número de móvil para realizar esta acción.",
		GetApptCategoriesInvalidParameters: "Parámetro no válido",
		GetTicketCategoriesInvalidParameters: "Parámetro no válido",
		GetApptCategoriesDataFetched: "Datos obtenidos con éxito",
		GetTicketCategoriesDataFetched: "Datos obtenidos con éxito",
		GetApptCategoriesNotFound: "No se encontraron datos.",
		GetTicketCategoriesNotFound: "No se encontraron datos.",
		GetApptCategoriesNotFoundFromBranchCode: "Sucursal no encontrada",
		GetApptCategoriesInternalServerError:
			"Ocurrió un error al obtener los datos",
		GetTicketCategoriesInternalServerError:
			"Ocurrió un error al obtener los datos",
		GetAllDaysSlotsOfBranchInvalidParameters: "Parámetros no válidos",
		GetAllDaysSlotsOfBranchNoFutureSlots:
			"No hay citas disponibles en el futuro",
		GetAllDaysSlotsOfBranchDataFetched: "Datos obtenidos con éxito",
		GetAllDaysSlotsOfBranchNotFound: "No se encontraron datos",
		GetAllDaysSlotsOfBranchInternalServerError:
			"Se produjo un error al obtener los datos",
		GetDisabledDatesInvalidParameters: "Parámetros no válidos",
		GetDisabledDatesDataFetched: "Datos obtenidos con éxito",
		GetDisabledDatesNotFound: "No se encontraron datos",
		GetDisabledDatesInternalServerError:
			"Se produjo un error al obtener los datos",
		GetSlotDetailInvalidParameters: "Parámetros no válidos",
		GetSlotDetailDataFetched: "Datos obtenidos con éxito",
		GetSlotDetailNotFound: "No se encontraron datos",
		GetSlotDetailInternalServerError:
			"Se produjo un error al obtener los datos",
		GetNearestBranchesInvalidParameters: "Parámetros no válidos",
		GetNearestBranchesDataFetched: "Datos obtenidos con éxito",
		GetNearestBranchesNotFound: "Sucursal no encontrada",
		GetNearestBranchesNotFoundFromBranchCode: "Sucursal no encontrada",
		GetNearestBranchesInternalServerError:
			"Se produjo un error al obtener los datos",
		GetBranchListDataFetched: "Datos obtenidos con éxito",
		GetBranchListNotFound: "Sucursal no encontrada",
		GetBranchListNotFoundFromBranchCode: "Sucursal no encontrada",
		GetBranchListInternalServerError:
			"Se produjo un error al obtener los datos",
		GetBranchListByCategoryInvalidParameters: "Parámetros no válidos",
		GetBranchListByCategoryDataFetched: "Datos obtenidos con éxito",
		GetBranchListByCategoryNotFound: "Sucursal no encontrada",
		GetBranchListByCategoryNotFoundFromBranchCode: "Sucursal no encontrada",
		GetBranchListByCategoryInternalServerError:
			"Se produjo un error al obtener los datos",
		GetticketJourneyInvalidParameters: "Parámetros inválidos",
		CancelAppointmentInvalidParameters: "Parámetros inválidos",
		CancelAppointmentInternalServerError:
			"Ocurrió un error interno del servidor.",
		CancelAppointmentFailure: "¡Cita no cancelada!",
		CancelAppointmentFailurePermitted:"Ya no se permiten cambios en esta cita.",
		CancelAppointmentNotFound: "¡Cita no encontrada!",
		CancelAppointmentSuccess: "¡Cita cancelada exitosamente!",
		VerifyAppointmentInvalidParameters: "Parámetros inválidos",
		VerifyAppointmentInternalServerError:
			"Ocurrió un error interno del servidor.",
		VerifyAppointmentNotFound: "¡No se encontró ninguna cita!",
		VerifyAppointmentSuccess: "¡Datos obtenidos con éxito!",
		VerifyAppointmentUserOutOfRange: "Estás fuera del área de servicio. Por favor, visita la sucursal para verificar tu cita.",
		RescheduleAppointmentTicketInvalidParameters: "Parámetros inválidos",
		RescheduleAppointmentTicketFailedToCancel:
			"No se pudo cancelar la cita anterior",
		RescheduleAppointmentTicketSuccess: "Reprogramación de la cita exitosa",
		RescheduleAppointmentInternalServerError:
			"Se produjo un error al obtener los datos",
		RescheduleAppointmentSomethingWentWrong: "Algo salió mal",
		AppointmentServedInvalidParameters: "Parámetros inválidos",
		UpdateAppointmentStatusInvalidParameters: "Parámetros inválidos",
		UpdateAppointmentStatusDataSuccess: "¡Datos actualizados exitosamente!",
		UpdateAppointmentStatusInternalServerError:
			"Se produjo un error al actualizar los datos",
		UpdateAppointmentStatusSomethingWentWrong: "Algo salió mal",
		GenerateOTPAppointmentNotFound:
			"Numéro de rendez-vous ou adresse e-mail invalide !",
		GenerateOTPInvalidParamters:
			"Parámetros inválidos, se requiere correo electrónico o número de teléfono",
		GenerateOTPSuccess: "OTP generado con éxito",
		GenerateOTPInternalServerError: "Ocurrió un error al generar el OTP",
		ValidateOTPInvalidParameters:
			"Parámetros inválidos, se requiere correo electrónico o número de teléfono",
		ValidateOTPSuccess: "OTP válido",
		ValidateOTPBadRequest: "OTP inválido o expirado",
		ValidateOTPInternalServerError: "Ocurrió un error al validar el OTP",
		maxQuota: "se ha alcanzado la cuota máxima para el espacio.",
		ICSFileSub: "Confirmación cita proyecto en {{branch_title}}",
		ICSFileDesciption: "Confirmación de cita previa en {{branch_title}}",
		AppointmentRescheduleSuccessMsg: "Reprogramación de cita exitosa",
		GenerateTokenInvalidParameters:
			"¡El campo sId es obligatorio para generar el token!",
		GenerateTokenInvalidGUID: "¡ID de GU inválido!",
		GenerateTokenClientIdNotFound: "¡sId no encontrado!",
		GenerateTokenSuccess: "Token generado con éxito",
		GenerateTokenInternalServerError: "Se produjo un error al generar el token",
		VerifyJWTMissingSID:
			"¡El campo sId es obligatorio para verificar el token!",
		VerifyJWTInvalidGUID: "¡ID de GU inválido!",
		VerifyJWTClientIdNotFound: "¡sId no encontrado!",
		VerifyJWTNoToken: "Se requiere un token para la autenticación",
		VerifyJWTInvalidToken: "¡Token inválido!",
		VerifyJWTInternalServerError: "Se produjo un error al verificar el token",
		CannotBookonBackDateandTime:
			"No se puede reservar una cita en fechas o franjas horarias anteriores",
		GetBranchIdInvalidParameters: "Parámetro inválido",
		GetBranchIdDataFetched: "Datos obtenidos con éxito",
		GetBranchIdInternalServerError: "Ocurrió un error interno en el servidor",
		GetBranchIdNotFound: "Sucursal no encontrada",
		TicketIssueInvalidParameters: "Parámetro inválido",
		TicketIssueBranchIsClosed: "La sucursal está cerrada",
		TicketIssueBranchHoliday: "La sucursal está cerrada",
		TicketIssueWorkFlowNotExist: "El flujo de trabajo no existe",
		TicketIssueTicketNotFound: "Ticket no encontrado",
		TicketIssueActivityNotFound: "Actividad no encontrada",
		TicketIssueCategoryNotFound: "Categoría no encontrada",
		TicketIssueBranchNotFound: "Sucursal no encontrada",
		TicketIssueSuccess: "Ticket emitido con éxito",
		TicketIssueInternalServerError: "Ocurrió un error al emitir el ticket",
		TicketIssueSomethingWentWrong: "Algo salió mal",
		TicketIssueRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		GetRabbitMQIPInvalidParameters: "Parámetro inválido",
		GetRabbitMQIPNotFound: "La sucursal no existe",
		GetRabbitMQIPInternalServerError: "Ocurrió un error al obtener los datos",
		GetRabbitMQIPSuccess: "IP de RabbitMQ de la sucursal obtenida con éxito",
		GetWaitingTicketDataInvalidParameters: "Parámetro inválido",
		GetWaitingTicketDataSuccess: "Datos obtenidos con éxito",
		GetWaitingTicketDataInvalidParameters: "Parámetros inválidos",
		GetWaitingTicketDataInternalError: "Algo salió mal",
		GetWaitingTicketDataNotFound: "Lista de tickets en espera no encontrada",
		GetOperatorRoleFromBranchIdInvalidParameters: "Parámetros inválidos",
		GetOperatorRoleFromBranchIdSuccess: "Rol de operador obtenido con éxito",
		GetOperatorRoleFromBranchIdNotFound: "Rol de operador no encontrado",
		GetOperatorRoleFromBranchIdInternalError:
			"Ocurrió un error al obtener los datos",
		OpenCounterInvalidParameters: "Parámetro inválido",
		OpenCounterSuccess: "Mostrador abierto con éxito",
		OpenCounterInternalServerError: "Ocurrió un error al abrir el mostrador",
		OpenCounterRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		OpenCounterDataFailure: "Algo salió mal",
		OpenCounterBranchDataFailure: "Algo salió mal",
		CloseCounterInvalidParameters: "Parámetro inválido",
		CloseCounterSuccess: "Mostrador cerrado con éxito",
		CloseCounterInternalServerError: "Ocurrió un error al cerrar el mostrador",
		CloseCounterRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		CloseCounterDataFailure: "Algo salió mal",
		CloseCounterBranchDataFailure: "Algo salió mal",
		GetCategoryWaitingListInvalidParameters: "Parámetro inválido",
		GetCategoryWaitingListSuccess: "Datos obtenidos con éxito",
		GetCategoryWaitingListInternalServerError:
			"Ocurrió un error al obtener los datos",
		GetCategoryWaitingListRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetCategoryWaitingListDataFailure: "Algo salió mal",
		GetCategoryWaitingListBranchDataFailure: "Algo salió mal",
		NoShowTicketInvalidParameters: "Parámetro inválido",
		NoShowTicketSuccess: "Ticket marcado como no-show con éxito",
		NoShowTicketInternalServerError: "Ocurrió un error al marcar como no-show",
		NoShowTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		NoShowTicketDataFailure: "Algo salió mal",
		NoShowTicketBranchDataFailure: "Algo salió mal",
		PostProcessingTicketInvalidParameters: "Parámetro inválido",
		PostProcessingTicketSuccess:
			"Ticket marcado como post-procesamiento con éxito",
		PostProcessingTicketInternalServerError:
			"Ocurrió un error al marcar como post-procesamiento",
		PostProcessingTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		PostProcessingTicketDataFailure: "Algo salió mal",
		PostProcessingTicketBranchDataFailure: "Algo salió mal",
		SetProfileIdInvalidParameters: "Parámetro inválido",
		SetProfileIdSuccess: "Perfil configurado con éxito",
		SetProfileIdInternalServerError: "Ocurrió un error al configurar el perfil",
		SetProfileIdRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		SetProfileIdDataFailure: "Algo salió mal",
		SetProfileIdBranchDataFailure: "Algo salió mal",
		AddMatterTicketInvalidParameters: "Parámetro inválido",
		AddMatterTicketSuccess: "Código de asunto agregado con éxito",
		AddMatterTicketInternalServerError:
			"Ocurrió un error al agregar el código de asunto",
		AddMatterTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		AddMatterTicketDataFailure: "Algo salió mal",
		AddMatterTicketBranchDataFailure: "Algo salió mal",
		RandomCallTicketInvalidParameters: "Parámetro inválido",
		RandomCallTicketSuccess: "Ticket aleatorio llamado con éxito",
		RandomCallTicketInternalServerError:
			"Ocurrió un error al realizar la llamada aleatoria",
		RandomCallTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		RandomCallTicketDataFailure: "Algo salió mal",
		RandomCallTicketBranchDataFailure: "Algo salió mal",
		RandomCallTicketTicketNotFound: "Ticket no encontrado",
		GetCounterInfoInvalidParameters: "Parámetro inválido",
		GetCounterInfoSuccess: "Datos enviados con éxito",
		GetCounterInfoInternalServerError: "Ocurrió un error al obtener los datos",
		GetCounterInfoRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		GetCounterInfoDataFailure: "Algo salió mal",
		GetCounterInfoBranchDataFailure: "Algo salió mal",
		IssueTicketWithJourneyInvalidParameters: "Parámetro inválido",
		IssueTicketWithJourneySuccess: "Ticket emitido con éxito",
		IssueTicketWithJourneyInternalServerError:
			"Ocurrió un error al emitir el ticket",
		IssueTicketWithJourneyRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		IssueTicketWithJourneyDataFailure: "Algo salió mal",
		IssueTicketWithJourneyBranchDataFailure: "Algo salió mal",
		IssueTicketWithJourneyCustomerHaveTicket:
			"El cliente ya ha emitido un ticket",
		EditTicketInvalidParameters: "Parámetro inválido",
		EditTicketSuccess: "Edición de ticket realizada con éxito",
		EditTicketInternalServerError: "Ocurrió un error al editar el ticket",
		EditTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		EditTicketDataFailure: "Algo salió mal",
		EditTicketBranchDataFailure: "Algo salió mal",
		GetCategoriesInvalidParameters: "Parámetro inválido",
		GetCategoriesDataNotFound: "Datos no encontrados",
		GetCategoriesSuccess: "Datos enviados con éxito",
		GetCategoriesInternalServerError: "Ocurrió un error al obtener los datos",
		TransferCategoryTicketInvalidParameters: "Parámetro inválido",
		TransferCategoryTicketSuccess: "Ticket transferido con éxito",
		TransferCategoryTicketInternalServerError:
			"Ocurrió un error al transferir el ticket",
		TransferCategoryTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		TransferCategoryTicketDataFailure: "Algo salió mal",
		TransferCategoryTicketBranchDataFailure: "Algo salió mal",
		TransferBulkTicketInvalidParameters: "Parámetro inválido",
		TransferBulkTicketSuccess: "Tickets en bloque transferidos con éxito",
		TransferBulkTicketInternalServerError:
			"Ocurrió un error al transferir los tickets en bloque",
		TransferBulkTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		TransferBulkTicketDataFailure: "Algo salió mal",
		TransferBulkTicketBranchDataFailure: "Algo salió mal",
		CallTicketTicketInvalidParameters: "Parámetro inválido",
		CallTicketTicketSuccess: "Ticket llamado con éxito",
		CallTicketTicketInternalServerError: "Ocurrió un error al llamar al ticket",
		CallTicketTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		CallTicketTicketDataFailure: "Algo salió mal",
		CallTicketTicketBranchDataFailure: "Algo salió mal",
		ServeTicketInvalidParameters: "Parámetro inválido",
		ServeTicketSuccess: "Ticket atendido con éxito",
		ServeTicketInternalServerError: "Ocurrió un error al atender el ticket",
		ServeTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		ServeTicketDataFailure: "Algo salió mal",
		ServeTicketBranchDataFailure: "Algo salió mal",
		WaitTicketInvalidParameters: "Parámetro inválido",
		WaitTicketSuccess: "Ticket puesto en espera con éxito",
		WaitTicketInternalServerError:
			"Ocurrió un error al poner el ticket en espera",
		WaitTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		WaitTicketDataFailure: "Algo salió mal",
		WaitTicketBranchDataFailure: "Algo salió mal",
		RecallTicketInvalidParameters: "Parámetro inválido",
		RecallTicketSuccess: "Ticket llamado nuevamente con éxito",
		RecallTicketInternalServerError:
			"Ocurrió un error al llamar nuevamente el ticket",
		RecallTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		RecallTicketDataFailure: "Algo salió mal",
		RecallTicketBranchDataFailure: "Algo salió mal",
		ActiveCountersDataInvalidParameters: "Parámetro inválido",
		ActiveCountersDataSuccess: "Ticket llamado nuevamente con éxito",
		ActiveCountersDataInternalServerError:
			"Ocurrió un error al llamar nuevamente el ticket",
		ActiveCountersDataRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		ActiveCountersDataDataFailure: "Algo salió mal",
		ActiveCountersDataBranchDataFailure: "Algo salió mal",
		CancelTicketInvalidParameters: "Parámetro inválido",
		CancelTicketSuccess: "Ticket cancelado con éxito",
		CancelTicketInternalServerError: "Ocurrió un error al cancelar el ticket",
		CancelTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		CancelTicketDataFailure: "Algo salió mal",
		CancelTicketBranchDataFailure: "Algo salió mal",
		TicketNotFound: "Ticket no encontrado",
		CategoryNotFound: "Categoría no encontrada",
		WorkFlowNotExist: "El flujo de trabajo no existe",
		TicketNotFound: "Ticket no encontrado",
		InternalServerError: "Error interno del servidor",
		BranchisClosed: "La sucursal está cerrada",
		InternalServerError: "Error interno del servidor",

		Unknown: "Error desconocido",
		SystemTooMuchStress: "El sistema está bajo demasiado estrés",
		MessageInvalid: "Mensaje inválido",
		DeviceUnauthorized: "Dispositivo no autorizado",
		UserUnauthorized: "Usuario no autorizado",
		UserAlreadyLoggedInOtherCounter:
			"Usuario ya ha iniciado sesión en otro mostrador",
		MaxTSULoggedIn: "Número máximo de TSU conectados",
		CategoryNotFound: "Categoría no encontrada",
		WorkFlowNotExist: "El flujo de trabajo no existe",
		WorkflowCompleted: "Flujo de trabajo completado",
		UndefinedCategoryInSequence: "Categoría indefinida en la secuencia",
		PoolNotDefined: "Pool no definido",
		UnknownException: "Excepción desconocida",
		CounterNotFound: "Contador no encontrado",
		CounterProfileNotSet: "Perfil del contador no configurado",
		CounterOpenedByOtherUser: "Mostrador abierto por otro usuario",
		CounterAlreadyOpened: "El mostrador ya está abierto",
		CounterAlreadyClosed: "El mostrador ya está cerrado",
		CounterNotOpened: "El mostrador no está abierto",
		CounterTicketsInLocalWait: "Tickets en espera local",
		ActivityNotFound: "Actividad no encontrada",
		ActivityNotStarted: "Actividad no iniciada",
		TicketAlreadyCancelled: "Ticket ya cancelado",
		TicketNotFound: "Ticket no encontrado",
		TicketMatterRequired: "Asunto del ticket requerido",
		TicketMatterAlreadySelected: "Asunto del ticket ya seleccionado",
		TicketNoShowMatterSelected:
			"No se permite no show para el asunto seleccionado",
		TicketInvalidTransferRequest:
			"Solicitud de transferencia inválida para el ticket",
		NoTicketFound: "No se encontró ningún ticket",
		TicketInvalidTransferTarget: "Destino de transferencia de ticket inválido",
		UnknownStateTransition: "Transición de estado desconocida",
		UnknownStateTransitionCounter:
			"Transición de estado desconocida en el mostrador",
		UnknownStateTransitionUser:
			"Transición de estado desconocida para el usuario",
		BranchIsClosed: "La sucursal está cerrada",
		BranchIsClosing: "La sucursal se está cerrando",
		SystemIsInitializing: "El sistema se está inicializando",
		PasswordNotEntered: "Contraseña no ingresada",
		CredentialsNotEntered: "Credenciales no ingresadas",
		RandomCallLimitExceeded: "Límite de llamadas aleatorias excedido",
		PushbackIndexNotEnabled: "El índice de retroceso no está habilitado",
		EmailSubjectTemplateOTP: "OTP",
		EmailMsgTemplateOTP: "Tu OTP es {otp}",
		SmsMsgTemplateOTP: "Tu OTP es {otp}",
		REPRINT_TEMPLATE_MSG:
			"Estimado huésped, su número de espera es {0}. Número de paciente {1}",
		GetProductTypesInvalidParameters: "Parámetro no válido",
		GetProductTypesDataFetched: "Datos obtenidos con éxito",
		GetProductTypesNotFound: "No se encontraron datos.",
		GetProductTypesInternalServerError: "Ocurrió un error al obtener los datos",
		GetgetProductFamiliesInvalidParameters: "Parámetro no válido",
		GetProductFamiliesDataFetched: "Datos obtenidos con éxito",
		GetTicketJourneyDataFetched: "Datos obtenidos con éxito",
		GetProductFamiliesNotFound: "No se encontraron datos.",
		GetProductFamiliesInternalServerError:
			"Ocurrió un error al obtener los datos",
		GetPhoneModelsInvalidParameters: "Parámetro no válido",
		GetPhoneModelsDataFetched: "Datos obtenidos con éxito",
		GetPhoneModelsNotFound: "No se encontraron datos.",
		GetPhoneModelsInternalServerError: "Ocurrió un error al obtener los datos",
		BranchEvolutionInvalidParameters: "Parámetro no válido",
		BranchEvolutionDataFetched: "Datos obtenidos con éxito",
		BranchEvolutionNotFound: "No se encontraron datos.",
		BranchEvolutionInternalServerError: "Ocurrió un error al obtener los datos",
		BranchTicketInfoInvalidParameters: "Parámetro no válido",
		BranchTicketInfoDataFetched: "Datos obtenidos con éxito",
		BranchTicketInfoNotFound: "No se encontraron datos.",
		BranchTicketInfoInternalServerError:
			"Ocurrió un error al obtener los datos",
		TicketTrackingSummaryInvalidParameters: "Parámetro no válido",
		TicketTrackingSummaryDataFetched: "Datos obtenidos con éxito",
		TicketTrackingSummaryNotFound: "No se encontraron datos.",
		TicketTrackingSummaryInternalServerError:
			"Ocurrió un error al obtener los datos",
		DesiredSlotErrorForDuplicateRecord: "Data is already saved",
		DesiredSlotGenericError: "Algo salió mal",
		saveDesireSlotSuccessMessage:
			"Los detalles de su horario preferido se han enviado con éxito.",
		GetAppointmentDataFetched: "Datos obtenidos con éxito",
		GetAppointmentInvalidParameters: "Parámetro inválido",
		GetAppointmentInternalServerError: "Ocurrió un error al obtener los datos",
		CancelBulkAppointmentInvalidParameters: "Parámetros inválidos",
		CancelBulkAppointmentInternalServerError:
			"Ocurrió un error interno en el servidor.",
		CancelBulkAppointmentNotFound: "¡Cita no encontrada!",
		CancelBulkAppointmentFailure: "¡Cita no cancelada!",
		CancelBulkAppointmentFailureState5:
			"No se puede cancelar la cita. Tiene un ticket emitido. Por favor, espere su turno.",
		CancelBulkAppointmentFailureState6:
			"Ya ha sido atendido. Gracias por visitarnos.",
		CancelBulkAppointmentFailureState2: "Ya ha cancelado su cita.",
		CancelBulkAppointmentFailureState12_4: "Su cita ha expirado.",
		CancelBulkAppointmentFailureState7_8:
			"No ha respondido a la llamada de su ticket durante mucho tiempo. Su ticket ha sido cancelado automáticamente por el sistema.",
		CancelBulkAppointmentFailureStateDefault:
			"La información de la cita no es válida para cancelar.",
		CancelBulkAppointmentFailureStateBackDate:
			"Está cancelando una cita de fecha pasada",
		CancelBulkAppointmentSuccess: "¡Cita cancelada con éxito!",
		CancelStatusSuccess: "Cancelado",
		CancelStatusFailure: "Fallido",
		GetCustomersInvalidParameters: "Parámetro no válido",
		GetCustomersDataFetched: "Datos obtenidos con éxito",
		GetCustomersDataFetchedCustomerHaveTicket:
			"El cliente ya ha emitido un ticket",
		GetCustomersNotFound: "No se encontraron datos.",
		GetCustomersInternalServerError: "Ocurrió un error al obtener los datos",
		GetCustomerListInvalidParameters: "Parámetro no válido",
		GetCustomerListDataFetched: "Datos obtenidos con éxito",
		GetCustomerListNotFound: "No se encontraron datos.",
		GetCustomerListInternalServerError: "Ocurrió un error al obtener los datos",
		InsertCustomerVisitInvalidParameters: "Parámetro no válido",
		InsertCustomerVisitDataFetched: "Datos obtenidos con éxito",
		InsertCustomerVisitDuplicateEntry:
			"Ya existe una visita del cliente con el mismo ID de ticket y ID de cliente.",
		InsertCustomerVisitInternalServerError:
			"Ocurrió un error al obtener los datos",
		CheckCustomerVisitInvalidParameters: "Parámetro no válido",
		CheckCustomerVisitDataFetched: "Datos obtenidos con éxito",
		CheckCustomerVisitNoEntry:
			"No se encontró ninguna entrada en la visita del cliente.",
		CheckCustomerVisitInternalServerError:
			"Ocurrió un error al obtener los datos",

		GetClientRegionInvalidParameters: "Parámetro no válido",
		GetClientRegionDataFetched: "Datos obtenidos con éxito",
		GetClientRegionNotFound: "No se encontraron datos.",
		GetClientRegionInternalServerError: "Ocurrió un error al obtener los datos",
		ShareCustomerInfoInvalidParameters: "Parámetro no válido",
		ShareCustomerInfoDataFetched: "Datos obtenidos con éxito",
		ShareCustomerInfoNotFound: "No se encontraron datos.",
		ShareCustomerInfoInternalServerError:
			"Ocurrió un error al obtener los datos",
		AddCustomerSuccess: "Cliente agregado con éxito",
		AddCustomerCustomerExists:
			"El cliente ya existe en los siguientes campos: {{matchedConditions}}",
		AddCustomerFailure: "Error al agregar cliente",
		AddCustomerInvalidParameters: "Parámetros inválidos",
		AddCustomerInternalServerError: "Ocurrió un error",
		UpdateCustomerInvalidParameters: "Parámetros inválidos",
		UpdateCustomerSuccess: "Cliente actualizado con éxito",
		UpdateCustomerFailure: "Error al actualizar el cliente",
		UpdateCustomerInternalServerError: "Ocurrió un error",
		UpdateCustomerNotFound: "El cliente no existe.",
		UpdateCustomerModifyClientID: "El ID de cliente no se puede modificar.",
		UpdateCustomerModifyRegionID: "El ID de región no se puede modificar.",
		UpdateCustomerModifyID: "El ID del cliente no se puede modificar.",
		UpdateCustomerModifyCustomerID: "El ID del cliente no se puede modificar.",
		UserBranchTransferInvalidParameters: "Parámetro inválido",
		UserBranchTransferSuccess:
			"La transferencia de sucursal se completó con éxito",
		UserBranchTransferInternalServerError:
			"Ocurrió un error al procesar la transferencia de sucursal",
		UserBranchTransferRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		UserBranchTransferDataFailure: "Algo salió mal",
		UserBranchTransferBranchDataFailure: "Algo salió mal",
		GetEngineConfigurationInvalidParameters: "Parámetro inválido",
		GetEngineConfigurationSuccess: "Configuración del motor obtenida con éxito",
		GetEngineConfigurationInternalServerError:
			"Ocurrió un error al procesar la configuración del motor",
		GetEngineConfigurationRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetEngineConfigurationDataFailure: "Algo salió mal",
		GetEngineConfigurationBranchDataFailure: "Algo salió mal",
		getTicketDetailTicketFoundSuccessfully:
			"Detalle del ticket obtenido con éxito",
		getTicketDetailSomethingWentWrong:
			"Algo salió mal. Por favor, inténtelo de nuevo..",
		getTicketDetailTicketNotFound: "Ticket no encontrado",

		GetTicketDetailByTicketNumberDataFetched:
			"Detalles del ticket obtenidos con éxito",
		GetTicketDetailByTicketNumberSomethingWentWrong:
			"Algo salió mal. Por favor, inténtalo de nuevo.",
		GetTicketDetailByTicketNumberNotFound: "Ticket no encontrado",
		GetTicketDetailByTicketNumberInvalidParameters: "Parámetros inválidos",
		GetTicketDetailByTicketNumberInternalServerError: "Ocurrió un error",
		UserFound: "Usuario encontrado.",
		UserFoundAnotherBranch: "Usuario encontrado en otra rama.",
		UserAreadyLoggedInOnOtherCounter:
			"User is already logged-in from another counter",
		UsernamePasswordInvalid: "Nombre de usuario o contraseña no válidos",
		HeartbeatSyncExecution: "Sincronización en progreso",
		QuotaWaitTimeReachedClosingTime:
			"Customer may not be served before closing time.",
		QuotaWaitTimeReached: "Average wait time exceeds the limit.",
		GetBranchIPInvalidParameters: "Parámetro inválido",
		GetBranchIPNotFound: "La sucursal no existe",
		GetBranchIPInternalServerError: "Ocurrió un error al obtener los datos",
		GetBranchIPSuccess: "Dirección IP de la sucursal obtenida con éxito",
		SilentRandomCallTicketInvalidParameters: "Parámetro inválido",
		SilentRandomCallTicketSuccess: "Ticket llamado con éxito",
		SilentRandomCallTicketInternalServerError:
			"Ocurrió un error al procesar el ticket de llamada aleatoria silenciosa",
		SilentRandomCallTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		SilentRandomCallTicketDataFailure: "Algo salió mal",
		SilentRandomCallTicketBranchDataFailure: "Algo salió mal",
		newAppointment: "NUEVA_CITA",
		cancelledAppointment: "CITA_CANCELADA",
		rescheduledAppointment: "CITA_REPROGRAMADA",
		implicityCancelledAppointment: "CITA_CANCELADA_IMPLÍCITAMENTE",
		RescheduleCancelAppointmentFailure:
			"No pudimos reprogramar su cita porque ya no está activa. Por favor, reserve una nueva cita.",
		minLengthValidationError:
			"{{fieldName}} debe tener al menos {{minLength}} caracteres.",
		fieldValidationFailed: "Por favor proporcione información válida",
		TicketSetPriorityInvalidParameters: "Parámetro no válido",
		TicketSetPrioritySuccess: "Prioridad del ticket actualizada correctamente",
		TicketSetPriorityInternalServerError:
			"Ocurrió un error al actualizar la prioridad del ticket",
		TicketSetPriorityRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		TicketSetPriorityDataFailure: "Algo salió mal",
		TicketSetPriorityBranchDataFailure: "Algo salió mal",

		GetBranchCountersDataInvalidParameters: "Parámetro no válido",
		GetBranchCountersDataSuccess:
			"Datos de contadores de sucursal obtenidos correctamente",
		GetBranchCountersDataInternalServerError:
			"Ocurrió un error al obtener los datos de contadores de sucursal",
		GetBranchCountersDataRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetBranchCountersDataFailure: "Algo salió mal",
		GetBranchCountersDataBranchDataFailure: "Algo salió mal",
		GetBranchCountersDataNotFound: "No se encontraron datos",

		GetBranchCountersInvalidParameters: "Parámetro no válido",
		GetBranchCountersSuccess: "Contadores de sucursal obtenidos correctamente",
		GetBranchCountersInternalServerError:
			"Ocurrió un error al obtener los contadores de sucursal",
		GetBranchCountersRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetBranchCountersDataFailure: "Algo salió mal",
		GetBranchCountersBranchDataFailure: "Algo salió mal",
		GetBranchCountersNotFound: "No se encontraron datos",

		CounterStartActivityInvalidParameters: "Parámetro no válido",
		CounterStartActivitySuccess:
			"Actividad del contador iniciada correctamente",
		CounterStartActivityInternalServerError:
			"Ocurrió un error al iniciar la actividad del contador",
		CounterStartActivityRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		CounterStartActivityDataFailure: "Algo salió mal",
		CounterStartActivityBranchDataFailure: "Algo salió mal",

		CounterEndActivityInvalidParameters: "Parámetro no válido",
		CounterEndActivitySuccess:
			"Actividad del contador finalizada correctamente",
		CounterEndActivityInternalServerError:
			"Ocurrió un error al finalizar la actividad del contador",
		CounterEndActivityRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		CounterEndActivityDataFailure: "Algo salió mal",
		CounterEndActivityBranchDataFailure: "Algo salió mal",
		GetBranchServesDataInvalidParameters: "Parámetro no válido",
		GetBranchServesDataSuccess:
			"Datos de servicio de sucursal obtenidos correctamente",
		GetBranchServesDataInternalServerError:
			"Ocurrió un error al obtener los datos de servicio de sucursal",
		GetBranchServesDataRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetBranchServesDataDataFailure: "Algo salió mal",
		GetBranchServesDataBranchDataFailure: "Algo salió mal",
		GetBranchServesDataNotFound: "No se encontraron datos",
		RepeatCallTicketInvalidParameters: "Parámetro no válido",
		RepeatCallTicketSuccess: "Ticket repetido llamado correctamente",
		RepeatCallTicketInternalServerError:
			"Ocurrió un error al llamar el ticket repetido",
		RepeatCallTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		RepeatCallTicketDataFailure: "Algo salió mal",
		RepeatCallTicketBranchDataFailure: "Algo salió mal",
		FetchConfigurationInvalidParameters: "Parámetro no válido",
		FetchConfigurationSuccess: "Configuración obtenida correctamente",
		FetchConfigurationInternalServerError:
			"Ocurrió un error al obtener la configuración",
		FetchConfigurationRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		FetchConfigurationDataFailure: "Algo salió mal",
		FetchConfigurationBranchDataFailure: "Algo salió mal",
		GetCounterListInvalidParameters: "Parámetro no válido",
		GetCounterListSuccess: "Lista de contadores obtenida correctamente",
		GetCounterListInternalServerError:
			"Ocurrió un error al obtener la lista de contadores",
		GetCounterListRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		GetCounterListDataFailure: "Algo salió mal",
		GetCounterListBranchDataFailure: "Algo salió mal",

		GetTicketAgainstPayloadInvalidParameters: "Parámetro no válido",
		GetTicketAgainstPayloadSuccess: "Ticket obtenido correctamente",
		GetTicketAgainstPayloadInternalServerError:
			"Ocurrió un error al obtener el ticket contra payload",
		GetTicketAgainstPayloadRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetTicketAgainstPayloadDataFailure: "Algo salió mal",
		GetTicketAgainstPayloadBranchDataFailure: "Algo salió mal",
		GetTicketAgainstPayloadNotFound: "No se encontraron datos",
		GetBranchCancelDataInvalidParameters: "Parámetro no válido",
		GetBranchCancelDataSuccess:
			"Datos de cancelación de sucursal obtenidos correctamente",
		GetBranchCancelDataInternalServerError:
			"Ocurrió un error al obtener los datos de cancelación de sucursal",
		GetBranchCancelDataRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		GetBranchCancelDataDataFailure: "Algo salió mal",
		GetBranchCancelDataBranchDataFailure: "Algo salió mal",
		GetBranchCancelDataNotFound: "No se encontraron datos",
		StartServingTicketInvalidParameters: "Parámetro no válido",
		StartServingTicketSuccess: "Atención del ticket iniciada correctamente",
		StartServingTicketInternalServerError:
			"Ocurrió un error al iniciar la atención del ticket",
		StartServingTicketRequestAlreadyProcessed:
			"La solicitud ya ha sido procesada",
		StartServingTicketDataFailure: "Algo salió mal",
		StartServingTicketBranchDataFailure: "Algo salió mal",
		BranchNotFoundOrInactive: "Rama no encontrada o inactiva",
		changeAppointmentStatusInternalServerError:
			"Ocurrió un error al actualizar el estado de la cita.",
		changeAppointmentStatusEndpointMissingRequiredFields:
			"Falta un campo obligatorio.",
		changeAppointmentStatusEndpointDataSuccess:
			"¡El estado de la cita se actualizó correctamente!",
		changeAppointmentStatusEndpointAppointmentNotFound:
			"No se encontró ningún registro de cita o no se requiere actualización.",
		changeAppointmentStatusCannotSetAppointmentToActiveState:
			"No se permite el cambio del estado de la cita seleccionada.",
		CheckUserWithinBranchRadiusInvalidParameters: "Solicitud inválida",
		CheckUserWithinBranchRadiusWithinRange: "Acceso concedido",
		CheckUserWithinBranchRadiusOutOfRange: "Acceso denegado",
		CheckUserWithinBranchRadiusInternalServerError: "Servicio no disponible",
		ChangeLanguageTicketInvalidParameters: "Parámetro inválido",
		ChangeLanguageTicketSuccess: "Idioma cambiado con éxito",
		ChangeLanguageTicketInternalServerError: "Ocurrió un error al cambiar el idioma",
		ChangeLanguageTicketRequestAlreadyProcessed: "La solicitud ya ha sido procesada",
		ChangeLanguageTicketDataFailure: "Algo salió mal",
		ChangeLanguageTicketBranchDataFailure: "Algo salió mal",
		ChangeLanguageTicketLanguageNotFound: "Idioma no encontrado",
		ProcessCustomerAppointmentDataInvalidParameters: "Parámetro inválido",
		ProcessCustomerAppointmentDataSuccess: "Datos de cita procesados con éxito",
		ProcessCustomerAppointmentDataNotFound: "No se encontraron datos de cita para este cliente",
		ProcessCustomerAppointmentDataInternalServerError: "Ocurrió un error al procesar los datos de cita",
	},
	fr: {
		WhatsAppSystemCancelMsg:
			"Désolé, la succursale {0} où vous avez pris rendez-vous le {1} à {2} pour le service {3} est temporairement fermée. Voulez-vous fixer un rendez-vous dans  uneautre succursale ? Numéro de rendez-vous {4}",
		IssueAppointmentInternalServerError: "Erreur interne du serveur",
		IssueAppointmentSomethingWentWrong: "Une erreur s'est produite",
		IssueAppointmentAppointmentBookedSuccessfully:
			"Rendez-vous pris avec succès",
		IssueAppointmentHasAppointment: "Vous avez déjà un rendez-vous.",
		IssueAppointmentInvalidParameters:
			"Accès non autorisé. Veuillez d'abord entrer votre courriel ou numéro de téléphone pour effectuer cette action.",
		GetApptCategoriesInvalidParameters: "Paramètre invalide",
		GetTicketCategoriesInvalidParameters: "Paramètre invalide",
		GetApptCategoriesDataFetched: "Données récupérées avec succès",
		GetTicketCategoriesDataFetched: "Données récupérées avec succès",
		GetApptCategoriesNotFound: "Aucune donnée trouvée.",
		GetTicketCategoriesNotFound: "Aucune donnée trouvée.",
		GetApptCategoriesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetTicketCategoriesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetApptCategoriesNotFoundFromBranchCode: "Succursale introuvable",
		GetAllDaysSlotsOfBranchInvalidParameters: "Paramètres invalides",
		GetAllDaysSlotsOfBranchNoFutureSlots:
			"Aucun créneau disponible pour l'avenir",
		GetAllDaysSlotsOfBranchDataFetched: "Données récupérées avec succès",
		GetAllDaysSlotsOfBranchNotFound: "Aucune donnée trouvée.",
		GetAllDaysSlotsOfBranchInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetDisabledDatesInvalidParameters: "Paramètres invalides",
		GetDisabledDatesDataFetched: "Données récupérées avec succès",
		GetDisabledDatesNotFound: "Aucune donnée trouvée.",
		GetDisabledDatesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetSlotDetailInvalidParameters: "Paramètres invalides",
		GetSlotDetailDataFetched: "Données récupérées avec succès",
		GetSlotDetailNotFound: "Aucune donnée trouvée.",
		GetSlotDetailInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetNearestBranchesInvalidParameters: "Paramètres invalides",
		GetNearestBranchesDataFetched: "Données récupérées avec succès",
		GetNearestBranchesNotFound: "Succursale introuvable",
		GetNearestBranchesNotFoundFromBranchCode: "Succursale introuvable",
		GetNearestBranchesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetBranchListDataFetched: "Données récupérées avec succès",
		GetBranchListNotFound: "Succursale introuvable",
		GetBranchListNotFoundFromBranchCode: "Succursale introuvable",
		GetBranchListInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetBranchListByCategoryInvalidParameters: "Paramètres invalides",
		GetBranchListByCategoryDataFetched: "Données récupérées avec succès",
		GetBranchListByCategoryNotFound: "Succursale introuvable",
		GetBranchListByCategoryNotFoundFromBranchCode: "Succursale introuvable",
		GetBranchListByCategoryInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetticketJourneyInvalidParameters:
			"L'identifiant de la succursale et le numéro de billet sont requis.",
		CancelAppointmentInvalidParameters: "Paramètres invalides",
		CancelAppointmentInternalServerError:
			"Une erreur interne du serveur est survenue.",
		CancelAppointmentNotFound: "Rendez-vous introuvable !",
		CancelAppointmentFailure: "Le rendez-vous n’a pas été annulé !",
		CancelAppointmentFailurePermitted: "Il n’est plus possible de modifier ce rendez-vous.",
		CancelAppointmentSuccess: "Rendez-vous annulé avec succès !",
		VerifyAppointmentInvalidParameters: "Paramètres invalides",
		VerifyAppointmentInternalServerError:
			"Une erreur interne du serveur est survenue.",
		VerifyAppointmentNotFound: "Aucun rendez-vous trouvé !",
		VerifyAppointmentSuccess: "Données récupérées avec succès !",
		VerifyAppointmentUserOutOfRange: "Vous êtes en dehors de la zone de service. Veuillez vous rendre à l'agence pour vérifier votre rendez-vous.",
		RescheduleAppointmentTicketInvalidParameters: "Paramètres invalides",
		RescheduleAppointmentTicketFailedToCancel:
			"Échec de l'annulation du rendez-vous précédent",
		RescheduleAppointmentTicketSuccess:
			"Replanification du rendez-vous réussie",
		RescheduleAppointmentInternalServerError: "Erreur interne du serveur",
		RescheduleAppointmentSomethingWentWrong: "Une erreur s'est produite",
		AppointmentServedInvalidParameters: "Paramètres invalides",
		UpdateAppointmentStatusInvalidParameters: "Paramètres invalides",
		UpdateAppointmentStatusDataSuccess: "Données mises à jour avec succès !",
		UpdateAppointmentStatusInternalServerError:
			"Une erreur est survenue lors de la mise à jour des données",
		UpdateAppointmentStatusSomethingWentWrong: "Une erreur s'est produite",
		GenerateOTPAppointmentNotFound: "Informations invalides",
		GenerateOTPInvalidParamters: "Informations invalides",
		GenerateOTPSuccess: "Code OTP généré avec succès",
		GenerateOTPInternalServerError:
			"Une erreur est survenue lors de la génération du code OTP",
		ValidateOTPInvalidParameters:
			"Paramètres invalides. Courriel ou numéro de téléphone requis",
		ValidateOTPSuccess: "Code OTP valide",
		ValidateOTPBadRequest: "Code OTP ou paramètres invalides ou expirés",
		ValidateOTPInternalServerError:
			"Une erreur est survenue lors de la validation du code OTP",
		maxQuota: "Le quota maximal pour ce créneau a été atteint.",
		NewAppointmentFoundAgainstTheCustomer: "",
		ICSFileSub: "Confirmation de rendez-vous à {{branch_title}}",
		ICSFileDesciption: "Confirmation du rendez-vous à {{branch_title}}",
		AppointmentRescheduleSuccessMsg: "Rendez-vous replanifié avec succès",
		GenerateTokenInvalidParameters:
			"Le champ sId est requis pour générer le jeton !",
		GenerateTokenInvalidGUID: "GUID invalide !",
		GenerateTokenClientIdNotFound: "sId introuvable !",
		GenerateTokenSuccess: "Jeton généré avec succès",
		GenerateTokenInternalServerError:
			"Une erreur est survenue lors de la génération du jeton",
		VerifyJWTMissingSID: "Le champ sId est requis pour vérifier le jeton !",
		VerifyJWTInvalidGUID: "GUID invalide !",
		VerifyJWTClientIdNotFound: "sId introuvable !",
		VerifyJWTNoToken: "Un jeton est requis pour l'authentification",
		VerifyJWTInvalidToken: "Jeton invalide !",
		VerifyJWTInternalServerError:
			"Une erreur est survenue lors de la vérification du jeton",
		CannotBookonBackDateandTime:
			"Impossible de réserver un rendez-vous pour une date ou une heure passée",
		GetBranchIdInvalidParameters: "Paramètre invalide",
		GetBranchIdDataFetched: "Données récupérées avec succès",
		GetBranchIdInternalServerError:
			"Une erreur interne du serveur est survenue.",
		GetBranchIdNotFound: "Succursale introuvable",
		TicketIssueInvalidParameters: "Paramètre invalide",
		TicketIssueBranchIsClosed: "La succursale est fermée",
		TicketIssueBranchHoliday: "La succursale est fermée",
		TicketIssueWorkFlowNotExist: "Le flux de travail n'existe pas",
		TicketIssueTicketNotFound: "Billet introuvable",
		TicketIssueActivityNotFound: "Activité introuvable",
		TicketIssueCategoryNotFound: "Catégorie introuvable",
		TicketIssueBranchNotFound: "Succursale introuvable",
		TicketIssueSuccess: "Billet émis avec succès.",
		TicketIssueInternalServerError:
			"Une erreur est survenue lors de l’émission du billet",
		TicketIssueSomethingWentWrong: "Une erreur s'est produite",
		TicketIssueRequestAlreadyProcessed: "La demande a déjà été traitée",
		GetRabbitMQIPInvalidParameters: "Paramètre invalide",
		GetRabbitMQIPNotFound: "La succursale n'existe pas",
		GetRabbitMQIPInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetRabbitMQIPSuccess:
			"Adresse IP RabbitMQ de la succursale récupérée avec succès",
		GetWaitingTicketDataInvalidParameters: "Paramètre invalide",
		GetWaitingTicketDataSuccess: "Données récupérées avec succès",
		GetWaitingTicketDataInternalError: "Une erreur s'est produite",
		GetWaitingTicketDataNotFound: "Liste des billets en attente introuvable.",
		GetOperatorRoleFromBranchIdInvalidParameters: "Paramètres invalides",
		GetOperatorRoleFromBranchIdSuccess:
			"Rôle de l'opérateur récupéré avec succès",
		GetOperatorRoleFromBranchIdNotFound: "Rôle de l'opérateur introuvable.",
		GetOperatorRoleFromBranchIdInternalError:
			"Une erreur est survenue lors de la récupération des données",
		OpenCounterInvalidParameters: "Paramètre invalide",
		OpenCounterSuccess: "Guichet ouvert avec succès",
		OpenCounterInternalServerError:
			"Une erreur est survenue lors de l'ouverture du guichet",
		OpenCounterRequestAlreadyProcessed: "La demande a déjà été traitée",
		OpenCounterDataFailure: "Une erreur s'est produite",
		OpenCounterBranchDataFailure: "Une erreur s'est produite",
		CloseCounterInvalidParameters: "Paramètre invalide",
		CloseCounterSuccess: "Guichet fermé avec succès",
		CloseCounterInternalServerError:
			"Une erreur est survenue lors de la fermeture du guichet",
		CloseCounterRequestAlreadyProcessed: "La demande a déjà été traitée",
		CloseCounterDataFailure: "Une erreur s'est produite",
		CloseCounterBranchDataFailure: "Une erreur s'est produite",
		GetCategoryWaitingListInvalidParameters: "Paramètre invalide",
		GetCategoryWaitingListSuccess: "Données récupérées avec succès",
		GetCategoryWaitingListInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetCategoryWaitingListRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		GetCategoryWaitingListDataFailure: "Une erreur s'est produite",
		GetCategoryWaitingListBranchDataFailure: "Une erreur s'est produite",
		NoShowTicketInvalidParameters: "Paramètre invalide",
		NoShowTicketSuccess: "Billet marqué comme non-présent avec succès",
		NoShowTicketInternalServerError:
			"Une erreur est survenue lors du marquage de non-présence",
		NoShowTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		NoShowTicketDataFailure: "Une erreur s'est produite",
		NoShowTicketBranchDataFailure: "Une erreur s'est produite",
		PostProcessingTicketInvalidParameters: "Paramètre invalide",
		PostProcessingTicketSuccess:
			"Billet marqué comme post-traitement avec succès",
		PostProcessingTicketInternalServerError:
			"Une erreur est survenue lors du marquage du post-traitement",
		PostProcessingTicketRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		PostProcessingTicketDataFailure: "Une erreur s'est produite",
		PostProcessingTicketBranchDataFailure: "Une erreur s'est produite",
		SetProfileIdInvalidParameters: "Paramètre invalide",
		SetProfileIdSuccess: "Profil configuré avec succès",
		SetProfileIdInternalServerError:
			"Une erreur est survenue lors de la configuration du profil",
		SetProfileIdRequestAlreadyProcessed: "La demande a déjà été traitée",
		SetProfileIdDataFailure: "Une erreur s'est produite",
		SetProfileIdBranchDataFailure: "Une erreur s'est produite",
		AddMatterTicketInvalidParameters: "Paramètre invalide",
		AddMatterTicketSuccess: "Code de sujet ajouté avec succès",
		AddMatterTicketInternalServerError:
			"Une erreur est survenue lors de l'ajout du code de sujet",
		AddMatterTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		AddMatterTicketDataFailure: "Une erreur s'est produite",
		AddMatterTicketBranchDataFailure: "Une erreur s'est produite",
		RandomCallTicketInvalidParameters: "Paramètre invalide",
		RandomCallTicketSuccess: "Billet aléatoire appelé avec succès",
		RandomCallTicketInternalServerError:
			"Une erreur est survenue lors de l'appel aléatoire",
		RandomCallTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		RandomCallTicketDataFailure: "Une erreur s'est produite",
		RandomCallTicketBranchDataFailure: "Une erreur s'est produite",
		RandomCallTicketTicketNotFound: "Billet introuvable",
		GetCounterInfoInvalidParameters: "Paramètre invalide",
		GetCounterInfoSuccess: "Données envoyées avec succès",
		GetCounterInfoInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetCounterInfoRequestAlreadyProcessed: "La demande a déjà été traitée",
		GetCounterInfoDataFailure: "Une erreur s'est produite",
		GetCounterInfoBranchDataFailure: "Une erreur s'est produite",
		IssueTicketWithJourneyInvalidParameters: "Paramètre invalide",
		IssueTicketWithJourneySuccess: "Billet émis avec succès.",
		IssueTicketWithJourneyInternalServerError:
			"Une erreur est survenue lors de l’émission du billet",
		IssueTicketWithJourneyRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		IssueTicketWithJourneyDataFailure: "Une erreur s'est produite",
		IssueTicketWithJourneyBranchDataFailure: "Une erreur s'est produite",
		IssueTicketWithJourneyCustomerHaveTicket: "Le client a déjà un billet émis",
		EditTicketInvalidParameters: "Paramètre invalide",
		EditTicketSuccess: "Billet modifié avec succès",
		EditTicketInternalServerError:
			"Une erreur est survenue lors de la modification du billet",
		EditTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		EditTicketDataFailure: "Une erreur s'est produite",
		EditTicketBranchDataFailure: "Une erreur s'est produite",
		GetCategoriesInvalidParameters: "Paramètre invalide",
		GetCategoriesDataNotFound: "Données non trouvées",
		GetCategoriesSuccess: "Données envoyées avec succès",
		GetCategoriesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",

		TransferCategoryTicketInvalidParameters: "Paramètre invalide",
		TransferCategoryTicketSuccess: "Billet transféré avec succès",
		TransferCategoryTicketInternalServerError:
			"Une erreur est survenue lors du transfert du billet",
		TransferCategoryTicketRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		TransferCategoryTicketDataFailure: "Une erreur s'est produite",
		TransferCategoryTicketBranchDataFailure: "Une erreur s'est produite",

		TransferBulkTicketInvalidParameters: "Paramètre invalide",
		TransferBulkTicketSuccess: "Billets transférés en lot avec succès",
		TransferBulkTicketInternalServerError:
			"Une erreur est survenue lors du transfert des billets en lot",
		TransferBulkTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		TransferBulkTicketDataFailure: "Une erreur s'est produite",
		TransferBulkTicketBranchDataFailure: "Une erreur s'est produite",

		CallTicketTicketInvalidParameters: "Paramètre invalide",
		CallTicketTicketSuccess: "Billet appelé avec succès",
		CallTicketTicketInternalServerError:
			"Une erreur est survenue lors de l’appel du billet",
		CallTicketTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		CallTicketTicketDataFailure: "Une erreur s'est produite",
		CallTicketTicketBranchDataFailure: "Une erreur s'est produite",

		ServeTicketInvalidParameters: "Paramètre invalide",
		ServeTicketSuccess: "Billet servi avec succès",
		ServeTicketInternalServerError:
			"Une erreur est survenue lors du service du billet",
		ServeTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		ServeTicketDataFailure: "Une erreur s'est produite",
		ServeTicketBranchDataFailure: "Une erreur s'est produite",

		WaitTicketInvalidParameters: "Paramètre invalide",
		WaitTicketSuccess: "Billet mis en attente avec succès",
		WaitTicketInternalServerError:
			"Une erreur est survenue lors de la mise en attente du billet",
		WaitTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		WaitTicketDataFailure: "Une erreur s'est produite",
		WaitTicketBranchDataFailure: "Une erreur s'est produite",

		RecallTicketInvalidParameters: "Paramètre invalide",
		RecallTicketSuccess: "Billet rappelé avec succès",
		RecallTicketInternalServerError:
			"Une erreur est survenue lors du rappel du billet",
		RecallTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		RecallTicketDataFailure: "Une erreur s'est produite",
		RecallTicketBranchDataFailure: "Une erreur s'est produite",

		ActiveCountersDataInvalidParameters: "Paramètre invalide",
		ActiveCountersDataSuccess: "Guichets actifs récupérés avec succès",
		ActiveCountersDataInternalServerError:
			"Une erreur est survenue lors de la récupération des guichets actifs",
		ActiveCountersDataRequestAlreadyProcessed: "La demande a déjà été traitée",
		ActiveCountersDataDataFailure: "Une erreur s'est produite",
		ActiveCountersDataBranchDataFailure: "Une erreur s'est produite",

		CancelTicketInvalidParameters: "Paramètre invalide",
		CancelTicketSuccess: "Billet annulé avec succès",
		CancelTicketInternalServerError:
			"Une erreur est survenue lors de l'annulation du billet",
		CancelTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		CancelTicketDataFailure: "Une erreur s'est produite",
		CancelTicketBranchDataFailure: "Une erreur s'est produite",

		BranchisClosed: "La succursale est fermée",
		TicketNotFound: "Billet introuvable",
		CategoryNotFound: "Catégorie introuvable",
		WorkFlowNotExist: "Le flux de travail n'existe pas",
		InternalServerError: "Erreur interne du serveur",
		Unknown: "Erreur inconnue",
		SystemTooMuchStress: "Le système subit trop de pression",
		MessageInvalid: "Message invalide",
		DeviceUnauthorized: "Appareil non autorisé",
		UserUnauthorized: "Utilisateur non autorisé",
		UserAlreadyLoggedInOtherCounter:
			"Utilisateur déjà connecté depuis un autre guichet",
		MaxTSULoggedIn: "Nombre maximal de TSU connectés",
		CategoryNotFound: "Catégorie introuvable",
		WorkFlowNotExist: "Le flux de travail n'existe pas",
		WorkflowCompleted: "Flux de travail terminé",
		UndefinedCategoryInSequence: "Catégorie non définie dans la séquence",
		PoolNotDefined: "Pool non défini",
		UnknownException: "Exception inconnue",
		CounterNotFound: "Guichet introuvable",
		CounterProfileNotSet: "Profil du guichet non défini",
		CounterOpenedByOtherUser: "Guichet ouvert par un autre utilisateur",
		CounterAlreadyOpened: "Guichet déjà ouvert",
		CounterAlreadyClosed: "Guichet déjà fermé",
		CounterNotOpened: "Guichet non ouvert",
		CounterTicketsInLocalWait: "Billets en attente locale",
		ActivityNotFound: "Activité introuvable",
		ActivityNotStarted: "Activité non commencée",
		TicketAlreadyCancelled: "Billet déjà annulé",
		TicketNotFound: "Billet introuvable",
		TicketMatterRequired: "Sujet du billet requis",
		TicketMatterAlreadySelected: "Sujet du billet déjà sélectionné",
		TicketNoShowMatterSelected:
			"Aucun absent autorisé pour le sujet sélectionné",
		TicketInvalidTransferRequest:
			"Demande de transfert invalide pour le billet",
		NoTicketFound: "Aucun billet trouvé",
		TicketInvalidTransferTarget: "Cible de transfert invalide pour le billet",
		UnknownStateTransition: "Transition d'état inconnue",
		UnknownStateTransitionCounter: "Transition d'état inconnue au guichet",
		UnknownStateTransitionUser: "Transition d'état inconnue pour l'utilisateur",
		BranchIsClosed: "Succursale fermée",
		BranchIsClosing: "Succursale en cours de fermeture",
		SystemIsInitializing: "Le système est en cours d'initialisation",
		PasswordNotEntered: "Mot de passe non saisi",
		CredentialsNotEntered: "Identifiants non saisis",
		RandomCallLimitExceeded: "Limite d'appels aléatoires dépassée",
		PushbackIndexNotEnabled: "Index de réattribution non activé",
		EmailSubjectTemplateOTP: "OTP",
		EmailMsgTemplateOTP: "Courriel : votre code OTP est {otp}",
		SmsMsgTemplateOTP: "SMS : votre code OTP est {otp}",
		REPRINT_TEMPLATE_MSG:
			"Cher client, votre numéro d’attente est {0}. Numéro du patient {1}",
		virtualAppointmentEventSummary: "Rendez-vous virtuel",
		virtualAppointmentLocation: "En ligne",
		virtualAppointmentDescription: "Réunion de rendez-vous virtuel",
		GetProductTypesInvalidParameters: "Paramètre invalide",
		GetProductTypesDataFetched: "Données récupérées avec succès",
		GetProductTypesNotFound: "Aucune donnée trouvée.",
		GetProductTypesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetgetProductFamiliesInvalidParameters: "Paramètre invalide",
		GetProductFamiliesDataFetched: "Données récupérées avec succès",
		GetTicketJourneyDataFetched: "Données récupérées avec succès",
		GetProductFamiliesNotFound: "Aucune donnée trouvée.",
		GetProductFamiliesInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetPhoneModelsInvalidParameters: "Paramètre invalide",
		GetPhoneModelsDataFetched: "Données récupérées avec succès",
		GetPhoneModelsNotFound: "Aucune donnée trouvée.",
		GetPhoneModelsInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		BranchEvolutionInvalidParameters: "Paramètre invalide",
		BranchEvolutionDataFetched: "Données récupérées avec succès",
		BranchEvolutionNotFound: "Aucune donnée trouvée.",
		BranchEvolutionInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		BranchTicketInfoInvalidParameters: "Paramètre invalide",
		BranchTicketInfoDataFetched: "Données récupérées avec succès",
		BranchTicketInfoNotFound: "Aucune donnée trouvée.",
		BranchTicketInfoInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		TicketTrackingSummaryInvalidParameters: "Paramètre invalide",
		TicketTrackingSummaryDataFetched: "Données récupérées avec succès",
		TicketTrackingSummaryNotFound: "Aucune donnée trouvée.",
		TicketTrackingSummaryInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GENERATEOTPPLEASEPROVIDEAPPTNO: "Veuillez fournir le numéro de rendez-vous",
		DesiredSlotErrorForDuplicateRecord: "Les données sont déjà enregistrées",
		DesiredSlotGenericError: "Une erreur s'est produite",
		saveDesireSlotSuccessMessage:
			"Vos détails de créneau horaire souhaité ont été soumis avec succès",
		GetAppointmentDataFetched: "Données récupérées avec succès",
		GetAppointmentInvalidParameters: "Paramètre invalide",
		GetAppointmentInternalServerError:
			"Une erreur est survenue lors de la récupération des données",

		CancelBulkAppointmentInvalidParameters: "Paramètres invalides",
		CancelBulkAppointmentInternalServerError:
			"Une erreur interne du serveur est survenue.",
		CancelBulkAppointmentNotFound: "Rendez-vous introuvable !",
		CancelBulkAppointmentFailure: "Le rendez-vous n’a pas été annulé !",
		CancelBulkAppointmentFailureState5:
			"Impossible d’annuler le rendez-vous. Un billet a déjà été émis. Veuillez attendre votre tour.",
		CancelBulkAppointmentFailureState6:
			"Vous avez déjà été servi. Merci de votre visite.",
		CancelBulkAppointmentFailureState2:
			"Vous avez déjà annulé votre rendez-vous.",
		CancelBulkAppointmentFailureState12_4: "Votre rendez-vous a expiré.",
		CancelBulkAppointmentFailureState7_8:
			"Vous n'avez pas répondu à l'appel de votre billet depuis un certain temps. Votre billet a été annulé automatiquement par le système.",
		CancelBulkAppointmentFailureStateDefault:
			"Informations sur le rendez-vous non valides pour l’annulation.",
		CancelBulkAppointmentFailureStateBackDate:
			"Vous annulez un rendez-vous à une date passée",
		CancelBulkAppointmentSuccess: "Rendez-vous annulé avec succès !",
		CancelStatusSuccess: "Annulé",
		CancelStatusFailure: "Échec",

		GetCustomersInvalidParameters: "Paramètre invalide",
		GetCustomersDataFetched: "Données récupérées avec succès",
		GetCustomersDataFetchedCustomerHaveTicket:
			"Le client a déjà un billet émis",
		GetCustomersNotFound: "Aucune donnée trouvée.",
		GetCustomersInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetCustomerListInvalidParameters: "Paramètre invalide",
		GetCustomerListDataFetched: "Données récupérées avec succès",
		GetCustomerListNotFound: "Aucune donnée trouvée.",
		GetCustomerListInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		InsertCustomerVisitInvalidParameters: "Paramètre invalide",
		InsertCustomerVisitDataFetched: "Données récupérées avec succès",
		InsertCustomerVisitDuplicateEntry:
			"Une visite client avec le même ID de billet et ID de client existe déjà.",
		InsertCustomerVisitInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		CheckCustomerVisitInvalidParameters: "Paramètre invalide",
		CheckCustomerVisitDataFetched: "Données récupérées avec succès",
		CheckCustomerVisitNoEntry: "Aucune entrée trouvée pour la visite client.",
		CheckCustomerVisitInternalServerError:
			"Une erreur est survenue lors de la récupération des données",

		GetClientRegionInvalidParameters: "Paramètre invalide",
		GetClientRegionDataFetched: "Données récupérées avec succès",
		GetClientRegionNotFound: "Aucune donnée trouvée.",
		GetClientRegionInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		ShareCustomerInfoInvalidParameters: "Paramètre invalide",
		ShareCustomerInfoDataFetched: "Données récupérées avec succès",
		ShareCustomerInfoNotFound: "Aucune donnée trouvée.",
		ShareCustomerInfoInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		AddCustomerSuccess: "Client ajouté avec succès",
		AddCustomerCustomerExists:
			"Le client existe déjà pour les champs suivants : {{matchedConditions}}",
		AddCustomerFailure: "Échec de l'ajout du client",
		AddCustomerInvalidParameters: "Paramètres invalides",
		AddCustomerInternalServerError: "Une erreur est survenue",
		UpdateCustomerInvalidParameters: "Paramètres invalides",
		UpdateCustomerSuccess: "Client mis à jour avec succès",
		UpdateCustomerFailure: "Échec de la mise à jour du client",
		UpdateCustomerInternalServerError: "Une erreur est survenue",
		UpdateCustomerNotFound: "Le client n'existe pas.",
		UpdateCustomerModifyClientID: "L'ID client ne peut pas être modifié.",
		UpdateCustomerModifyRegionID: "L'ID de région ne peut pas être modifié.",
		UpdateCustomerModifyID: "L'ID client ne peut pas être modifié.",
		UpdateCustomerModifyCustomerID: "L'ID client ne peut pas être modifié.",
		getTicketDetailTicketFoundSuccessfully:
			"Détails du billet récupérés avec succès",
		getTicketDetailSomethingWentWrong:
			"Une erreur s'est produite. Veuillez réessayer.",
		getTicketDetailTicketNotFound: "Billet introuvable",

		GetTicketDetailByTicketNumberDataFetched:
			"Détails du billet récupérés avec succès",
		GetTicketDetailByTicketNumberSomethingWentWrong:
			"Une erreur s'est produite. Veuillez réessayer.",
		GetTicketDetailByTicketNumberNotFound: "Billet introuvable",
		GetTicketDetailByTicketNumberInvalidParameters: "Paramètres invalides",
		GetTicketDetailByTicketNumberInternalServerError: "Une erreur est survenue",

		UpdateReissueStatusNumberDataFetched:
			"Détails du billet récupérés avec succès",
		UpdateReissueStatusNumberSomethingWentWrong:
			"Une erreur s'est produite. Veuillez réessayer.",
		UpdateReissueStatusNumberNotFound: "Billet introuvable",
		UpdateReissueStatusNumberInvalidParameters: "Paramètres invalides",
		UpdateReissueStatusNumberInternalServerError: "Une erreur est survenue",

		UserBranchTransferInvalidParameters: "Paramètre invalide",
		UserBranchTransferSuccess: "Transfert de succursale effectué avec succès",
		UserBranchTransferInternalServerError:
			"Une erreur est survenue lors du transfert de succursale",
		UserBranchTransferRequestAlreadyProcessed: "La demande a déjà été traitée",
		UserBranchTransferDataFailure: "Une erreur s'est produite",
		UserBranchTransferBranchDataFailure: "Une erreur s'est produite",

		GetEngineConfigurationInvalidParameters: "Paramètre invalide",
		GetEngineConfigurationSuccess:
			"Configuration du moteur récupérée avec succès",
		GetEngineConfigurationInternalServerError:
			"Une erreur est survenue lors du traitement de la configuration du moteur",
		GetEngineConfigurationRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		GetEngineConfigurationDataFailure: "Une erreur s'est produite",
		GetEngineConfigurationBranchDataFailure: "Une erreur s'est produite",

		UserFound: "Utilisateur trouvé.",
		UserFoundAnotherBranch: "Utilisateur trouvé dans une autre succursale.",
		UserAreadyLoggedInOnOtherCounter:
			"User is already logged-in from another counter",
		UsernamePasswordInvalid: "Nom d'utilisateur ou mot de passe invalide",
		HeartbeatSyncExecution: "Synchronisation en cours",
		QuotaWaitTimeReachedClosingTime:
			"Le client pourrait ne pas être servi avant la fermeture.",
		QuotaWaitTimeReached: "Le temps d'attente moyen dépasse la limite.",

		GetBranchIPInvalidParameters: "Paramètre invalide",
		GetBranchIPNotFound: "La succursale n'existe pas",
		GetBranchIPInternalServerError:
			"Une erreur est survenue lors de la récupération des données",
		GetBranchIPSuccess: "Adresse IP de la succursale récupérée avec succès",

		SilentRandomCallTicketInvalidParameters: "Paramètre invalide",
		SilentRandomCallTicketSuccess: "Billet appelé avec succès",
		SilentRandomCallTicketInternalServerError:
			"Une erreur est survenue lors du traitement de l'appel aléatoire silencieux",
		SilentRandomCallTicketRequestAlreadyProcessed:
			"La demande a déjà été traitée",
		SilentRandomCallTicketDataFailure: "Une erreur s'est produite",
		SilentRandomCallTicketBranchDataFailure: "Une erreur s'est produite",
		newAppointment: "NOUVEAU_RDV",
		cancelledAppointment: "RDV_ANNULÉ",
		rescheduledAppointment: "RDV_REPROGRAMMÉ",
		implicityCancelledAppointment: "RDV_ANNULÉ_IMPLICITEMENT",
		RescheduleCancelAppointmentFailure:
			"Nous n’avons pas pu replanifier votre rendez-vous car il n'est plus actif. Veuillez prendre un nouveau rendez-vous.",
		minLengthValidationError:
			"{{fieldName}} doit contenir au moins {{minLength}} caractères.",
		fieldValidationFailed: "Veuillez fournir des informations valides",
		TicketSetPriorityInvalidParameters: "Paramètre non valide",
		TicketSetPrioritySuccess: "Priorité du ticket mise à jour avec succès",
		TicketSetPriorityInternalServerError:
			"Une erreur s'est produite lors de la mise à jour de la priorité du ticket",
		TicketSetPriorityRequestAlreadyProcessed: "La requête a déjà été traitée",
		TicketSetPriorityDataFailure: "Quelque chose s'est mal passé",
		TicketSetPriorityBranchDataFailure: "Quelque chose s'est mal passé",

		GetBranchCountersDataInvalidParameters: "Paramètre non valide",
		GetBranchCountersDataSuccess:
			"Données des compteurs de succursale récupérées avec succès",
		GetBranchCountersDataInternalServerError:
			"Une erreur s'est produite lors de la récupération des données des compteurs de succursale",
		GetBranchCountersDataRequestAlreadyProcessed:
			"La requête a déjà été traitée",
		GetBranchCountersDataFailure: "Quelque chose s'est mal passé",
		GetBranchCountersDataBranchDataFailure: "Quelque chose s'est mal passé",
		GetBranchCountersDataNotFound: "Aucune donnée trouvée",

		GetBranchCountersInvalidParameters: "Paramètre non valide",
		GetBranchCountersSuccess: "Compteurs de succursale récupérés avec succès",
		GetBranchCountersInternalServerError:
			"Une erreur s'est produite lors de la récupération des compteurs de succursale",
		GetBranchCountersRequestAlreadyProcessed: "La requête a déjà été traitée",
		GetBranchCountersDataFailure: "Quelque chose s'est mal passé",
		GetBranchCountersBranchDataFailure: "Quelque chose s'est mal passé",
		GetBranchCountersNotFound: "Aucune donnée trouvée",

		CounterStartActivityInvalidParameters: "Paramètre non valide",
		CounterStartActivitySuccess: "Activité du compteur démarrée avec succès",
		CounterStartActivityInternalServerError:
			"Une erreur s'est produite lors du démarrage de l'activité du compteur",
		CounterStartActivityRequestAlreadyProcessed:
			"La requête a déjà été traitée",
		CounterStartActivityDataFailure: "Quelque chose s'est mal passé",
		CounterStartActivityBranchDataFailure: "Quelque chose s'est mal passé",

		CounterEndActivityInvalidParameters: "Paramètre non valide",
		CounterEndActivitySuccess: "Activité du compteur terminée avec succès",
		CounterEndActivityInternalServerError:
			"Une erreur s'est produite lors de la fin de l'activité du compteur",
		CounterEndActivityRequestAlreadyProcessed: "La requête a déjà été traitée",
		CounterEndActivityDataFailure: "Quelque chose s'est mal passé",
		CounterEndActivityBranchDataFailure: "Quelque chose s'est mal passé",
		GetBranchServesDataInvalidParameters: "Paramètre non valide",
		GetBranchServesDataSuccess:
			"Données de service de succursale récupérées avec succès",
		GetBranchServesDataInternalServerError:
			"Une erreur s'est produite lors de la récupération des données de service de succursale",
		GetBranchServesDataRequestAlreadyProcessed: "La requête a déjà été traitée",
		GetBranchServesDataDataFailure: "Quelque chose s'est mal passé",
		GetBranchServesDataBranchDataFailure: "Quelque chose s'est mal passé",
		GetBranchServesDataNotFound: "Aucune donnée trouvée",
		RepeatCallTicketInvalidParameters: "Paramètre non valide",
		RepeatCallTicketSuccess: "Ticket répété appelé avec succès",
		RepeatCallTicketInternalServerError:
			"Une erreur s'est produite lors de l'appel du ticket répété",
		RepeatCallTicketRequestAlreadyProcessed: "La requête a déjà été traitée",
		RepeatCallTicketDataFailure: "Quelque chose s'est mal passé",
		RepeatCallTicketBranchDataFailure: "Quelque chose s'est mal passé",
		FetchConfigurationInvalidParameters: "Paramètre non valide",
		FetchConfigurationSuccess: "Configuration récupérée avec succès",
		FetchConfigurationInternalServerError:
			"Une erreur s'est produite lors de la récupération de la configuration",
		FetchConfigurationRequestAlreadyProcessed: "La requête a déjà été traitée",
		FetchConfigurationDataFailure: "Quelque chose s'est mal passé",
		FetchConfigurationBranchDataFailure: "Quelque chose s'est mal passé",
		GetCounterListInvalidParameters: "Paramètre non valide",
		GetCounterListSuccess: "Liste des compteurs récupérée avec succès",
		GetCounterListInternalServerError:
			"Une erreur s'est produite lors de la récupération de la liste des compteurs",
		GetCounterListRequestAlreadyProcessed: "La requête a déjà été traitée",
		GetCounterListDataFailure: "Quelque chose s'est mal passé",
		GetCounterListBranchDataFailure: "Quelque chose s'est mal passé",

		GetTicketAgainstPayloadInvalidParameters: "Paramètre non valide",
		GetTicketAgainstPayloadSuccess: "Ticket récupéré avec succès",
		GetTicketAgainstPayloadInternalServerError:
			"Une erreur s'est produite lors de la récupération du ticket contre payload",
		GetTicketAgainstPayloadRequestAlreadyProcessed:
			"La requête a déjà été traitée",
		GetTicketAgainstPayloadDataFailure: "Quelque chose s'est mal passé",
		GetTicketAgainstPayloadBranchDataFailure: "Quelque chose s'est mal passé",
		GetTicketAgainstPayloadNotFound: "Aucune donnée trouvée",
		GetBranchCancelDataInvalidParameters: "Paramètre non valide",
		GetBranchCancelDataSuccess:
			"Données d'annulation de succursale récupérées avec succès",
		GetBranchCancelDataInternalServerError:
			"Une erreur s'est produite lors de la récupération des données d'annulation de succursale",
		GetBranchCancelDataRequestAlreadyProcessed: "La requête a déjà été traitée",
		GetBranchCancelDataDataFailure: "Quelque chose s'est mal passé",
		GetBranchCancelDataBranchDataFailure: "Quelque chose s'est mal passé",
		GetBranchCancelDataNotFound: "Aucune donnée trouvée",
		StartServingTicketInvalidParameters: "Paramètre non valide",
		StartServingTicketSuccess: "Prise en charge du ticket démarrée avec succès",
		StartServingTicketInternalServerError:
			"Une erreur s'est produite lors du démarrage de la prise en charge du ticket",
		StartServingTicketRequestAlreadyProcessed: "La requête a déjà été traitée",
		StartServingTicketDataFailure: "Quelque chose s'est mal passé",
		StartServingTicketBranchDataFailure: "Quelque chose s'est mal passé",
		BranchNotFoundOrInactive: "Branche non trouvée ou inactive",
		changeAppointmentStatusInternalServerError:
			"Une erreur s'est produite lors de la mise à jour de l'état du rendez-vous.",
		changeAppointmentStatusEndpointMissingRequiredFields:
			"Champ obligatoire manquant.",
		changeAppointmentStatusEndpointDataSuccess:
			"Le statut du rendez-vous a été mis à jour avec succès !",
		changeAppointmentStatusEndpointAppointmentNotFound:
			"Aucun enregistrement de rendez-vous trouvé ou aucune mise à jour requise.",
		changeAppointmentStatusCannotSetAppointmentToActiveState:
			"La modification de l’état du rendez-vous sélectionné n’est pas autorisée.",
		CheckUserWithinBranchRadiusInvalidParameters: "Demande invalide",
		CheckUserWithinBranchRadiusWithinRange: "Accès accordé",
		CheckUserWithinBranchRadiusOutOfRange: "Accès refusé",
		CheckUserWithinBranchRadiusInternalServerError: "Service indisponible",
		ChangeLanguageTicketInvalidParameters: "Paramètre invalide",
		ChangeLanguageTicketSuccess: "Langue changée avec succès",
		ChangeLanguageTicketInternalServerError: "Une erreur s'est produite lors du changement de langue",
		ChangeLanguageTicketRequestAlreadyProcessed: "La demande a déjà été traitée",
		ChangeLanguageTicketDataFailure: "Quelque chose s'est mal passé",
		ChangeLanguageTicketBranchDataFailure: "Quelque chose s'est mal passé",
		ChangeLanguageTicketLanguageNotFound: "Langue non trouvée",
		ProcessCustomerAppointmentDataInvalidParameters: "Paramètre invalide",
		ProcessCustomerAppointmentDataSuccess: "Données de rendez-vous traitées avec succès",
		ProcessCustomerAppointmentDataNotFound: "Aucune donnée de rendez-vous trouvée pour ce client",
		ProcessCustomerAppointmentDataInternalServerError: "Une erreur s'est produite lors du traitement des données de rendez-vous",
	},
};

// Mapping response codes to translation keys
const responseTranslationMap = {
	UNKNOWN: "Unknown",
	SYSTEM_TOO_MUCH_STRESS: "SystemTooMuchStress",
	MESSAGE_INVALID: "MessageInvalid",
	DEVICE_UNAUTHORIZED: "DeviceUnauthorized",
	USER_UNAUTHORIZED: "UserUnauthorized",
	USER_FOUND: "UserFound",
	USER_FOUND_ANOTHER_BRANCH: "UserFoundAnotherBranch",
	USER_ALREADY_LOGGEDIN_ON_OTHER_COUNTER: "UserAreadyLoggedInOnOtherCounter",
	USERNAME_PASSWORD_INVALID: "UsernamePasswordInvalid",
	HEARTBEAT_SYNC_EXECUTION: "HeartbeatSyncExecution",
	USER_ALREADY_LOGGEDIN_FROM_OTHER_COUNTER: "UserAlreadyLoggedInOtherCounter",
	MAX_NUMBER_OF_ALLOWED_TSU_LOGGEDIN: "MaxTSULoggedIn",
	CATEGORY_NOT_FOUND: "CategoryNotFound",
	WORKFLOW_NOT_FOUND: "WorkFlowNotExist",
	WORKFLOW_COMPLETED: "WorkflowCompleted",
	UNDEFINED_CATEGORY_IN_SEQUENCE: "UndefinedCategoryInSequence",
	POOL_NOT_DEFINED: "PoolNotDefined",
	UNKNOWN_EXCEPTION: "UnknownException",
	COUNTER_NOT_FOUND: "CounterNotFound",
	COUNTER_PROFILE_NOT_SET: "CounterProfileNotSet",
	COUNTER_OPENED_BY_OTHER_USER: "CounterOpenedByOtherUser",
	COUNTER_ALREADY_OPENED: "CounterAlreadyOpened",
	COUNTER_ALREADY_CLOSED: "CounterAlreadyClosed",
	COUNTER_NOT_OPENED: "CounterNotOpened",
	COUNTER_TICKETS_IN_LOCALWAIT: "CounterTicketsInLocalWait",
	ACTIVITY_NOT_FOUND: "ActivityNotFound",
	ACTIVITY_NOT_STARTED: "ActivityNotStarted",
	TICKET_ALREADY_CANCEL: "TicketAlreadyCancelled",
	TICKET_NOT_FOUND: "TicketNotFound",
	TICKET_MATTER_REQUIRED: "TicketMatterRequired",
	TICKET_MATTER_ALREADYSELECTED: "TicketMatterAlreadySelected",
	TICKET_NOSHOW_NOTALLOWED_MATTERSELECTED: "TicketNoShowMatterSelected",
	TICKET_INVALID_TRANSFER_REQUEST: "TicketInvalidTransferRequest",
	NO_TICKET_FOUND: "NoTicketFound",
	TICKET_INVALID_TRANSFER_TARGET: "TicketInvalidTransferTarget",
	UNKNOWN_STATE_TRANSITION: "UnknownStateTransition",
	UNKNOWN_STATE_TRANSITION_COUNTER: "UnknownStateTransitionCounter",
	UNKNOWN_STATE_TRANSITION_USER: "UnknownStateTransitionUser",
	BRANCH_IS_CLOSED: "BranchIsClosed",
	BRANCH_IS_CLOSING: "BranchIsClosing",
	SYSTEM_IS_INITIALIZING: "SystemIsInitializing",
	PASSWORD_NOT_ENTERED: "PasswordNotEntered",
	CREDENTIALS_NOT_ENTERED: "CredentialsNotEntered",
	RANDOM_CALL_LIMIT_EXCEED: "RandomCallLimitExceeded",
	PUSHBACK_INDEX_NOT_ENABLED: "PushbackIndexNotEnabled",
	GENERATEOTPPLEASEPROVIDEAPPTNO: "Please Provide Appointment Number",
};

module.exports = {
	translationMsg,
	responseTranslationMap,
};
