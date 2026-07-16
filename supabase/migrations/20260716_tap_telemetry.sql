-- Young-learner interaction telemetry: how many taps (counter touches etc.)
-- preceded the answer. High taps + correct = still at the CONCRETE stage;
-- near-zero taps + fast correct = abstract/fluent. Feeds CPA staging and the
-- fluency gate without any extra testing.
alter table response_events add column if not exists taps int;
