# Version 15 — Two-song Service List Demo

Deploy all files into `interactive-notation/` (not the production root).

Visit `interactive-notation/service.html` or use the Service Song Lists entry on the beta catalogue.

Create a named list with section labels and KK 30 / KK 150; generate/copy the URL; share it; recipient opens the populated list; Choir View returns to the service list. Lists can be saved locally (browser only).

Shared links are snapshots. Editing requires sharing a new link. No server, accounts or analytics added. Existing notation files copied unchanged from Version 14.

QA: JS syntax validation and ZIP integrity checked; live browser/mobile testing still needed.

## Version 16: shared-link landing experience
Opening a valid `service.html?list=...` URL now hides the editor and saved-list management. The member sees the service order first. Edit List reveals the builder only when requested. Opening `service.html` without a list keeps the builder available for leaders.
