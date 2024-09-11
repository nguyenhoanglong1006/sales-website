-- Table: public.tb_object_tags

-- DROP TABLE IF EXISTS public.tb_object_tags;

CREATE TABLE IF NOT EXISTS public.tb_object_tags
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    object_id integer,
    tags_id integer,
    status smallint DEFAULT 0,
    maker_id integer,
    maker_date timestamp without time zone,
    type integer DEFAULT 0,
    CONSTRAINT tb_object_tags_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_object_tags
    OWNER to postgres;

COMMENT ON TABLE public.tb_object_tags
    IS 'thẻ khách hàng';