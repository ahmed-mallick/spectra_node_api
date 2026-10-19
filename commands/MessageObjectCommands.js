const convertValue = (value, type) => {
	switch (type) {
		case "string":
			return value != null ? value.toString() : "";

		case "number":
			return Number(value);

		case "bigint":
			return Number(value);

		case "boolean":
			if (typeof value === "boolean") return value;

			// Handle numeric values (1 = true, 0 = false)
			if (typeof value === "number") return value === 1;

			// Handle string values like "true", "false", "1", "0"
			if (typeof value === "string") {
				const v = value.trim().toLowerCase();
				if (v === "true" || v === "1") return true;
				if (v === "false" || v === "0") return false;
				return Boolean(v); // fallback: non-empty string = true
			}

			// Fallback for any other type
			return Boolean(value);

		case "array":
			return Array.isArray(value) ? value : [];

		case "json":
			try {
				return JSON.stringify(value);
			} catch {
				return "{}";
			}

		default:
			return value;
	}
};

// Create a base command object
const createBaseCommand = (actionName, params = {}) => ({
	action: actionName,
	params,
});

function createIssueTicketCommand(
	actionName,
	categoryName,
	priority,
	data,
	deviceType,
	manualTicketNumber,
	workflowCode,
	startTime,
	endTime
) {
	const params = {
		category_name: categoryName && convertValue(categoryName, "string"),
		deviceType: deviceType && convertValue(deviceType, "string"),
		priority: priority && convertValue(priority, "number"),
		manual_ticket_number:
			manualTicketNumber && convertValue(manualTicketNumber, "number"),
		startTime: startTime && convertValue(startTime, "string"),
		endTime: endTime && convertValue(endTime, "string"),
		payload: data && convertValue(data, "json"),
	};

	if (workflowCode !== 0) {
		params.workflow_code = workflowCode && convertValue(workflowCode, "number");
	}

	return createBaseCommand(actionName, params);
}

function createIssueTicketWithJourneyCommand(
	actionName,
	categoryName,
	priority,
	data,
	deviceType,
	manualTicketNumber,
	journey
) {
	const params = {
		category_name: categoryName && convertValue(categoryName, "string"),
		deviceType: deviceType && convertValue(deviceType, "string"),
		priority: priority && convertValue(priority, "number"),
		manual_ticket_number:
			manualTicketNumber && convertValue(manualTicketNumber, "number"),
		payload: data && convertValue(data, "json"),
		journey: journey && convertValue(journey, "json"),
	};

	return createBaseCommand(actionName, params);
}

function createTransferTicketCommand(
	actionName,
	counterId,
	targetId,
	reason,
	priority = null
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		target_id: targetId && convertValue(targetId, "number"),
		reason: reason && convertValue(reason, "string"),
	};

	if (priority) {
		params.priority = convertValue(priority, "string");
	}

	return createBaseCommand(actionName, params);
}

function createTransferBulkTicketCommand(actionName, targetId, data) {
	const params = {
		target_id: targetId && convertValue(targetId, "number"),
		ticket_ids: data && convertValue(data, "array"),
	};

	return createBaseCommand(actionName, params);
}

function createEditTicketCommand(
	actionName,
	categoryName,
	priority,
	data,
	ticketId,
	journey
) {
	const params = {
		category_name: categoryName && convertValue(categoryName, "string"),
		priority: priority && convertValue(priority, "number"),
		payload: data && convertValue(data, "json"),
		ticket_id: ticketId && convertValue(ticketId, "bigint"),
		journey: journey && convertValue(journey, "json"),
	};

	return createBaseCommand(actionName, params);
}

function createOpenCounterCommand(
	actionName,
	counterNumber,
	userName,
	password,
	admode,
	force_close_other_counters
) {
	const params = {
		counter_number: counterNumber && convertValue(counterNumber, "number"),
		username: userName && convertValue(userName, "string"),
		password: password && convertValue(password, "string"),
		admode: admode && convertValue(admode, "number"),
		force_close_other_counters:
			force_close_other_counters &&
			convertValue(force_close_other_counters, "boolean"),
	};

	return createBaseCommand(actionName, params);
}

function createCloseCounterCommand(
	actionName,
	counterId,
	reason,
	force = false
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		reason: reason && convertValue(reason, "string"),
		force: force && convertValue(force, "boolean"),
	};

	return createBaseCommand(actionName, params);
}

function createNoShowTicketCommand(
	actionName,
	counterId,
	ticketNumber,
	ticketPrefix
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		ticket_number: ticketNumber && convertValue(ticketNumber, "number"),
		ticket_prefix: ticketPrefix && convertValue(ticketPrefix, "string"),
	};

	return createBaseCommand(actionName, params);
}

function createRandomCallTicketCommand(
	actionName,
	counterId,
	ticketNumber,
	ticketPrefix
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		ticket_number: ticketNumber && convertValue(ticketNumber, "number"),
		ticket_prefix: ticketPrefix && convertValue(ticketPrefix, "string"),
	};

	return createBaseCommand(actionName, params);
}

function createCategoryWaitingListCommand(actionName) {
	return createBaseCommand(actionName, {});
}

function createCallTicketCommand(actionName, counterNumber) {
	const params = {
		counter_id: counterNumber && convertValue(counterNumber, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createServeTicketCommand(actionName, counterNumber) {
	const params = {
		counter_id: counterNumber && convertValue(counterNumber, "number"),
	};

	return createBaseCommand(actionName, params);
}

// COUNTER_RELEASE
function createCounterReleaseTicketCommand(actionName, counterNumber) {
	const params = {
		counter_id: counterNumber && convertValue(counterNumber, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createSetProfileIdCommand(actionName, counterId, profileId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		profile_id: profileId && convertValue(profileId, "string"),
	};

	return createBaseCommand(actionName, params);
}

function createPostProcessingTicketCommand(actionName, counterId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
	};

	return createBaseCommand(actionName, params);
}

const createGetCounterInfoCommand = (actionName, counterId, arrayList) => {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		spectraApi: true,
		info: "all",
	};

	if (arrayList && arrayList.length > 0) {
		params.requested_tags = convertValue(arrayList, "json");
	}

	return createBaseCommand(actionName, params);
};

function createAddMatterTicketCommand(
	actionName,
	counterId,
	matterId,
	objMatters = null
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
	};

	if (objMatters && objMatters.length > 0) {
		params.matters = convertValue(objMatters, "json");
	} else {
		params.matter_id = matterId && convertValue(matterId, "number");
	}

	return createBaseCommand(actionName, params);
}

function createWaitTicketCommand(actionName, counterNumber) {
	const params = {
		counter_id: counterNumber && convertValue(counterNumber, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createRecallTicketCommand(actionName, counterNumber, ticketId) {
	const params = {
		counter_id: counterNumber && convertValue(counterNumber, "number"),
		ticket_id: ticketId && convertValue(ticketId, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createCancelTicketCommand(
	actionName,
	ticketId,
	cancelReason,
	counterid
) {
	const params = {
		ticket_id: ticketId && convertValue(ticketId, "bigint"),
		cancel_reason: cancelReason && convertValue(cancelReason, "string"),
	};
	if (counterid) {
		params.counter_id = counterid && convertValue(counterid, "number");
	}

	return createBaseCommand(actionName, params);
}

function createActiveCountersDataCommand(actionName) {
	return createBaseCommand(actionName, {});
}

function createSetPayloadCommand(actionName, ticketId, counterNumber, payload) {
	const params = {
		ticket_id: ticketId && convertValue(ticketId, "bigint"),
		counter_id: counterNumber && convertValue(counterNumber, "number"),
		payload: payload && convertValue(JSON.stringify(payload), "string"),
	};

	return createBaseCommand(actionName, params);
}

function createUserBranchTransferCommand(
	actionName,
	username,
	password = null
) {
	const params = {
		username: username && convertValue(username, "string"),
	};
	if (password) {
		params.password = password && convertValue(password, "string");
	}

	return createBaseCommand(actionName, params);
}
function createEngineConfigurationCommand(actionName, arrayList = []) {
	const params = { requested_fields: convertValue(arrayList, "json") };

	return createBaseCommand(actionName, params);
}

function createSilentRandomCallTicketCommand(
	actionName,
	counterId,
	categoryName,
	deviceType,
	priority,
	data
) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		category_name: categoryName && convertValue(categoryName, "string"),
		deviceType: deviceType && convertValue(deviceType, "string"),
		priority: priority && convertValue(priority, "number"),
		payload: data && convertValue(data, "json"),
	};

	return createBaseCommand(actionName, params);
}

function createCounterStartActivityCommand(actionName, counterId, activityId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
		activity_id: activityId && convertValue(activityId, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createCounterEndActivityCommand(actionName, counterId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createRepeatCallTicketCommand(actionName, counterId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
	};

	return createBaseCommand(actionName, params);
}

const createGetConfigurationCommand = (actionName) => {
	return createBaseCommand(actionName, {});
};

function createCountersStatusCommand(actionName, active_counters) {
	let params = {};
	if (active_counters) {
		params = { active_counters: true };
	}
	return createBaseCommand(actionName, params);
}
function createTicketSetPriorityCommand(actionName, priority, ticketId) {
	const params = {
		priority: priority && convertValue(priority, "number"),
		ticket_id: ticketId && convertValue(ticketId, "bigint"),
	};
	return createBaseCommand(actionName, params);
}
function createStartServingTicketCommand(actionName, counterId) {
	const params = {
		counter_id: counterId && convertValue(counterId, "number"),
	};

	return createBaseCommand(actionName, params);
}

function createChangeLanguageTicketCommand(
	actionName,
	ticketIds,
	targetLanguage,
	counterId
) {
	const params = {
		ticket_ids: ticketIds && convertValue(ticketIds, "array"),
		target_language: targetLanguage && convertValue(targetLanguage, "string"),
		counter_id: counterId && convertValue(counterId, "number"),
	};

	return createBaseCommand(actionName, params);
}

module.exports = {
	createIssueTicketCommand,
	createIssueTicketWithJourneyCommand,
	createTransferBulkTicketCommand,
	createTransferTicketCommand,
	createEditTicketCommand,
	createOpenCounterCommand,
	createCloseCounterCommand,
	createNoShowTicketCommand,
	createRandomCallTicketCommand,
	createCategoryWaitingListCommand,
	createSetProfileIdCommand,
	createGetCounterInfoCommand,
	createPostProcessingTicketCommand,
	createServeTicketCommand,
	createCallTicketCommand,
	createAddMatterTicketCommand,
	createWaitTicketCommand,
	createRecallTicketCommand,
	createCancelTicketCommand,
	createActiveCountersDataCommand,
	createSetPayloadCommand,
	createUserBranchTransferCommand,
	createEngineConfigurationCommand,
	createSilentRandomCallTicketCommand,
	createCounterStartActivityCommand,
	createCounterEndActivityCommand,
	createRepeatCallTicketCommand,
	createGetConfigurationCommand,
	createCountersStatusCommand,
	createTicketSetPriorityCommand,
	createStartServingTicketCommand,
	createCounterReleaseTicketCommand, //COUNTER_RELEASE
	createChangeLanguageTicketCommand,

};
