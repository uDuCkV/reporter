import { User, Schedule } from 'rosters';
import TestResult from 'test-results-parser/src/models/TestResult';
import { PerformanceParseOptions } from 'performance-results-parser';
import { ParseOptions } from 'test-results-parser';
import PerformanceTestResult from 'performance-results-parser/src/models/PerformanceTestResult';

export type ExtensionName = 'report-portal-analysis' | 'hyperlinks' | 'mentions' | 'report-portal-history' | 'quick-chart-test-summary' | 'custom';
export type Hook = 'start' | 'end';
export type TargetName = 'slack' | 'teams' | 'chat' | 'custom';
export type PublishReportType = 'test-summary' | 'test-summary-slim' | 'failure-details';

export interface ConditionFunctionContext {
  target: Target;
  extension?: Extension,
  result: TestResult;
}
export type ConditionFunction = (ctx: ConditionFunctionContext) => boolean | Promise<boolean>;
export type Condition = 'pass' | 'fail' | 'passOrFail' | 'always' | 'never' | ConditionFunction;

/**
 * Extensions
 */

export interface ExtensionInputs {
  title?: string;
  title_link?: string;
  separator?: boolean;
}

export interface ReportPortalAnalysisInputs extends ExtensionInputs {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
  launch_name: string;
}

export interface ReportPortalHistoryInputs extends ExtensionInputs {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
  launch_name: string;
  history_depth: number;
}

export interface QuickChartTestSummaryInputs {
  url: string;
}

export interface MentionInputs extends ExtensionInputs {
  users?: User[];
  schedule?: Schedule;
}

export interface Extension {
  name: ExtensionName;
  condition?: Condition;
  hook?: Hook;
  inputs?: ReportPortalAnalysisInputs | ReportPortalHistoryInputs | HyperlinkInputs | MentionInputs | QuickChartTestSummaryInputs | PercyAnalysisInputs | CustomExtensionInputs;
}

export interface PercyAnalysisInputs extends ExtensionInputs {
  url?: string;
  token?: string;
  retries?: number;
  build_id?: string;
  project_id?: string;
  project_name?: string;
  organization_uid?: string;
  title_link_to_build: boolean;
}

export interface PercyAnalysisOutputs {
  build?: object;
  project?: object;
}

export interface PercyAnalysisExtension extends Extension {
  inputs?: PercyAnalysisInputs;
  outputs?: PercyAnalysisOutputs;
}

export interface CustomExtensionFunctionContext {
  target: Target;
  extension: Extension,
  result: TestResult;
  payload: any;
  root_payload: any;
}

export type CustomExtensionFunction = (ctx: CustomExtensionFunctionContext) => void | Promise<void>;

export interface CustomExtensionInputs extends ExtensionInputs {
  load: string | CustomExtensionFunction;
}

export interface CustomExtension extends Extension {
  inputs?: CustomExtensionInputs;
  outputs?: any;
}

export interface LinkUrlFunctionContext {
  target: Target;
  extension: HyperlinksExtension,
  result: TestResult;
}

export type LinkUrlFunction = (ctx: LinkUrlFunctionContext) => string | Promise<string>;

export interface Link {
  text: string;
  url: string | LinkUrlFunction;
  condition?: Condition;
}

export interface HyperlinkInputs extends ExtensionInputs {
  links: Link[];
}

export interface HyperlinksExtension extends Extension {
  inputs?: HyperlinkInputs;
}

/**
 * Targets
 */

export interface MetricConfig {
  name: string;
  condition: Condition;
  fields: string[];
}

export interface TargetInputs {
  url: string;
  title?: string;
  title_suffix?: string;
  title_link?: string;
  duration?: string;
  publish?: PublishReportType;
  only_failures?: boolean;
  metrics?: MetricConfig[];
}

export interface SlackInputs extends TargetInputs { }

export interface TeamsInputs extends TargetInputs {
  width?: string;
}

export interface ChatInputs extends TargetInputs { }

export interface CustomTargetFunctionContext {
  target: Target;
  result: TestResult;
}

export type CustomTargetFunction = (ctx: CustomTargetFunctionContext) => void | Promise<void>;

export interface CustomTargetInputs {
  load: string | CustomTargetFunction;
}

export interface Target {
  name: TargetName;
  condition: Condition;
  inputs: SlackInputs | TeamsInputs | ChatInputs | CustomTargetInputs;
  extensions?: Extension[];
}

export interface CustomResultOptions {
  type: string;
  result: TestResult | PerformanceTestResult;
}

export interface PublishReport {
  targets: Target[];
  results: ParseOptions[] | PerformanceParseOptions[] | CustomResultOptions[];
}

export interface PublishConfig {
  reports: PublishReport[];
}

export interface PublishOptions {
  config: string | PublishConfig;
}

export function publish(options: PublishOptions): Promise<any>
export function defineConfig(config: PublishConfig): PublishConfig