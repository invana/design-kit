import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  MetricGrid,
  MetricTile,
  PanelBox,
  Stack,
  TabbedPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@invana/ui";
import {
  FieldGroup,
  Form,
  FormField,
  type FieldConfig,
  type FieldValues,
  type RowConfig,
} from "@invana/forms";
import { Bot, Database, Plug, ShieldCheck } from "lucide-react";

import data from "../../../fixtures/themes/app-agents-settings.json";

// Story chrome, not a kit component: the settings the agents shell opens from
// its header, composed only from kit parts. All of it is read from
// `fixtures/themes/app-agents-settings.json`.

type Row = Record<string, string>;

const SETTINGS = data as unknown as {
  data: {
    metrics: { label: string; value: string; caption: string }[];
    datasets: Row[];
    graph: Row[];
  };
  llms: {
    models: Row[];
    budget: { label: string; value: string; caption: string; meter: number };
  };
  governance: {
    fields: FieldConfig[];
    rowConfig: RowConfig[];
    initial: FieldValues;
  };
  thirdParty: Row[];
};

/** A status word → the badge tone that means it. */
const TONE: Record<string, "success" | "info" | "warning" | undefined> = {
  synced: "success",
  ready: "success",
  connected: "success",
  refreshing: "info",
  stale: "warning",
};

const Status = ({ value }: { value: string }) => (
  <Badge variant={TONE[value] ? "soft" : "outline"} tone={TONE[value]}>
    {value}
  </Badge>
);

/** A table of records: one column per `[key, label]`, a cell drawn by `cell` when given. */
function Records({
  columns,
  rows,
  cell,
}: {
  columns: [string, string][];
  rows: Row[];
  cell?: (key: string, row: Row) => React.ReactNode;
}) {
  return (
    <Table seamless density="compact">
      <TableHeader>
        <TableRow>
          {columns.map(([key, label]) => (
            <TableHead key={key}>{label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {columns.map(([key]) => (
              <TableCell key={key}>{cell?.(key, row) ?? row[key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DataTab() {
  const { metrics, datasets, graph } = SETTINGS.data;
  const entities = graph.filter((g) => g.kind === "entity").length;
  return (
    <Stack gap="lg">
      <MetricGrid joined seamless>
        {metrics.map((m) => (
          <MetricTile
            key={m.label}
            label={m.label}
            value={m.value}
            caption={m.caption}
          />
        ))}
      </MetricGrid>
      <PanelBox title="Datasets" aside={datasets.length} flush>
        <Records
          columns={[
            ["name", "Dataset"],
            ["source", "Source"],
            ["rows", "Rows"],
            ["refreshed", "Refreshed"],
            ["status", "Status"],
          ]}
          rows={datasets}
          cell={(key, row) =>
            key === "status" ? <Status value={row.status} /> : undefined
          }
        />
      </PanelBox>
      <PanelBox
        title="Graph data"
        aside={`${entities} entity types · ${graph.length - entities} relation types`}
        flush
      >
        <Records
          columns={[
            ["type", "Type"],
            ["kind", "Kind"],
            ["count", "Count"],
            ["from", "From dataset"],
          ]}
          rows={graph}
        />
      </PanelBox>
    </Stack>
  );
}

function LlmsTab() {
  const { models, budget } = SETTINGS.llms;
  return (
    <Stack gap="lg">
      <PanelBox title="Models" aside={models.length} flush>
        <Records
          columns={[
            ["role", "Used for"],
            ["provider", "Provider"],
            ["model", "Model"],
            ["context", "Context"],
            ["status", "Status"],
          ]}
          rows={models}
          cell={(key, row) =>
            key === "status" ? <Status value={row.status} /> : undefined
          }
        />
      </PanelBox>
      <MetricGrid seamless>
        <MetricTile
          label={budget.label}
          value={budget.value}
          caption={budget.caption}
          meter={budget.meter}
        />
      </MetricGrid>
    </Stack>
  );
}

function GovernanceTab({ onSave }: { onSave: (values: FieldValues) => void }) {
  const { fields, rowConfig, initial } = SETTINGS.governance;
  const form = useForm<FieldValues>({ defaultValues: { governance: initial } });
  const { isDirty } = form.formState;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSave(values);
          form.reset(values);
        })}
      >
        <FieldGroup>
          <FormField.ObjectField
            control={form.control}
            name="governance"
            fields={fields}
            rowConfig={rowConfig}
            labelPosition="top"
            size="md"
          />
          <Button type="submit" disabled={!isDirty}>
            {isDirty ? "Save" : "Saved"}
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

function ThirdPartyTab() {
  const [services, setServices] = React.useState(SETTINGS.thirdParty);
  const toggle = (name: string) =>
    setServices((all) =>
      all.map((s) =>
        s.name === name
          ? {
              ...s,
              status: s.status === "connected" ? "not connected" : "connected",
            }
          : s,
      ),
    );
  return (
    <PanelBox
      title="Services"
      aside={`${services.filter((s) => s.status === "connected").length} of ${services.length} connected`}
      flush
    >
      <Records
        columns={[
          ["name", "Service"],
          ["usedFor", "Used for"],
          ["status", "Status"],
          ["action", ""],
        ]}
        rows={services}
        cell={(key, row) =>
          key === "status" ? (
            <Status value={row.status} />
          ) : key === "action" ? (
            <Button
              size="xs"
              variant="outline"
              onClick={() => toggle(row.name)}
            >
              {row.status === "connected" ? "Disconnect" : "Connect"}
            </Button>
          ) : undefined
        }
      />
    </PanelBox>
  );
}

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the settings are for — the graph's name. */
  scope: string;
  onSave?: (values: FieldValues) => void;
}

/** The graph's settings: data, LLMs, governance and third-party services, a tab each. */
export function SettingsDialog({
  open,
  onOpenChange,
  scope,
  onSave = () => {},
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Wide, and the tabs run edge to edge: the dialog drops its padding and
          the header takes it back, so the tab bar meets both sides. */}
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>{scope}</DialogDescription>
        </DialogHeader>
        <TabbedPanel
          defaultTab="data"
          className="h-[70vh] border-x-0 border-b-0"
          bodyClassName="p-6"
          tabs={[
            {
              value: "data",
              label: "Data",
              icon: Database,
              content: <DataTab />,
            },
            { value: "llms", label: "LLMs", icon: Bot, content: <LlmsTab /> },
            {
              value: "governance",
              label: "Governance",
              icon: ShieldCheck,
              content: <GovernanceTab onSave={onSave} />,
            },
            {
              value: "third-party",
              label: "Third-party",
              icon: Plug,
              content: <ThirdPartyTab />,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
