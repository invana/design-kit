import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

/** A kind of thing that goes with the one being deleted: what the engine says it owns. */
export interface ConfirmDeleteGoesWith {
  kind: React.ReactNode;
  count: React.ReactNode;
  /** A few names, already joined: `Routes by country · Hubs · +10`. */
  names?: React.ReactNode;
}

/** A separate thing that uses the one being deleted, so it cannot go yet. */
export interface ConfirmDeleteBlocker {
  key: string;
  name: React.ReactNode;
  kind: React.ReactNode;
  /** Where to let it go: a link, or a handler when the app routes itself. */
  href?: string;
  onSelect?: () => void;
  /** What the link says: `Remove AirRoutes from it`. */
  fix?: React.ReactNode;
}

export interface ConfirmDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `Delete Graph airways?` */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** What it owns and takes with it, as the engine counted it. The kit never counts. */
  goesWith?: ConfirmDeleteGoesWith[];
  /** What uses it. Any entry blocks the delete and says why. */
  blockedBy?: ConfirmDeleteBlocker[];
  /** What stays: `The data in the database is not touched.` */
  keep?: React.ReactNode;
  /**
   * The name to type before Delete turns on — the strongest level, for a Graph,
   * a model or a connection. Absent: a plain confirm.
   */
  confirmName?: string;
  /** The one line level: no tables, no name, a smaller dialog. For a panel, a story, a type in a draft. */
  light?: boolean;
  /** The warning line. Default: `This can’t be undone.` */
  undoNote?: React.ReactNode;
  /** The Delete button. Default `Delete`. */
  label?: React.ReactNode;
  /** The call is in flight: Delete is off and says so. */
  pending?: boolean;
  /** The engine's `detail` when the delete was refused or failed; the dialog stays open. */
  error?: React.ReactNode;
  /**
   * Runs the delete. The dialog does not close itself: a refused or failed call
   * must stay in front of the person, so the caller closes it on success.
   */
  onConfirm: () => void | Promise<void>;
}

const MUTED = "text-sm text-muted-foreground";

/**
 * The one confirmation for every delete.
 *
 * It composes `AlertDialog` and adds what a delete needs and a plain alert does
 * not: what goes with the thing, what blocks it, a name to type, and a Delete
 * that stays off — with its reason beside it — until nothing blocks and the
 * name matches. The engine answers `goes_with` and `blocked_by`; this only
 * draws them.
 *
 * Delete is a plain `Button`, not `AlertDialogAction`, because the action
 * closes the dialog on click and a refused delete (a 409) must stay open.
 */
export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open,
  onOpenChange,
  ...rest
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent
      className={cn("max-w-xl gap-0 p-0", rest.light && "max-w-md")}
    >
      <Body onOpenChange={onOpenChange} {...rest} />
    </AlertDialogContent>
  </AlertDialog>
);
ConfirmDelete.displayName = "ConfirmDelete";

/**
 * The dialog's inside. It lives in the content, which unmounts when the dialog
 * closes, so the name typed last time is gone the next time it opens.
 */
const Body: React.FC<Omit<ConfirmDeleteProps, "open">> = ({
  onOpenChange,
  title,
  description,
  goesWith,
  blockedBy,
  keep,
  confirmName,
  light,
  undoNote = "This can’t be undone.",
  label = "Delete",
  pending,
  error,
  onConfirm,
}) => {
  const [typed, setTyped] = React.useState("");

  const blocked = (blockedBy?.length ?? 0) > 0;
  const nameOk = !confirmName || typed === confirmName;
  const off = blocked || !nameOk || !!pending;
  const why = blocked
    ? "Delete turns on when nothing uses it."
    : !nameOk
      ? "Delete turns on when the name matches."
      : undefined;

  return (
    <>
      <AlertDialogHeader
        className={cn(
          "flex-row items-start gap-3 space-y-0 border-b text-left",
          light ? "px-4 py-3" : "px-5 py-4",
        )}
      >
        <TriangleAlert
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-destructive"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className={MUTED}>
              {description}
            </AlertDialogDescription>
          )}
        </div>
      </AlertDialogHeader>

      <div
        className={cn(
          "flex flex-col gap-3.5",
          light ? "px-4 py-3" : "px-5 py-4",
        )}
      >
        {!light && blocked && (
          <section aria-label="Blocked by" className="flex flex-col gap-1.5">
            <span className="font-semibold text-warning">
              Blocked by {blockedBy!.length}
            </span>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Used by</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Let it go</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockedBy!.map((b) => (
                  <TableRow key={b.key}>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.kind}</TableCell>
                    <TableCell>
                      {b.href ? (
                        <a
                          className="text-info hover:text-foreground"
                          href={b.href}
                        >
                          {b.fix ?? "Open"}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="text-info hover:text-foreground"
                          onClick={b.onSelect}
                        >
                          {b.fix ?? "Open"}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        )}

        {!light && goesWith && goesWith.length > 0 && (
          <section aria-label="Goes with it" className="flex flex-col gap-1.5">
            <span className="font-semibold">Goes with it</span>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kind</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Names</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goesWith.map((g, i) => (
                  <TableRow key={i}>
                    <TableCell>{g.kind}</TableCell>
                    <TableCell>{g.count}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {g.names}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        )}

        {!light && keep && <span className={MUTED}>{keep}</span>}

        {!light && confirmName && (
          <label className="flex flex-col gap-1">
            <span className="font-semibold">
              Type <code>{confirmName}</code> to confirm
            </span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the name"
              autoComplete="off"
              spellCheck={false}
              aria-label="Type the name to confirm"
              className="flex h-control-md w-full rounded-control border border-input bg-background px-2.5 py-0 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
            />
          </label>
        )}

        {error && (
          <p role="alert" className="m-0 text-sm text-destructive">
            {error}
          </p>
        )}

        <span className={cn(MUTED, "flex items-center gap-1.5")}>
          <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
          {undoNote}
        </span>
      </div>

      <AlertDialogFooter
        className={cn(
          "items-center gap-2 border-t sm:space-x-0",
          light ? "px-4 py-2.5" : "px-5 py-3",
        )}
      >
        {why && <span className={cn(MUTED, "me-auto")}>{why}</span>}
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={off}
          onClick={() => void onConfirm()}
        >
          {pending ? "Deleting…" : label}
        </Button>
      </AlertDialogFooter>
    </>
  );
};
