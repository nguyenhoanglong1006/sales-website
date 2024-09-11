-- Table: public.tb_contact_content

-- DROP TABLE IF EXISTS public.tb_contact_content;

CREATE TABLE IF NOT EXISTS public.tb_contact_content
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    code character varying(45) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    type integer NOT NULL,
    orders integer NOT NULL,
    language_id integer NOT NULL,
    status integer NOT NULL,
    maker_id integer NOT NULL,
    maker_date timestamp without time zone NOT NULL,
    CONSTRAINT tb_contact_content_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_contact_content
    OWNER to postgres;

COMMENT ON TABLE public.tb_contact_content
    IS 'Chi tiết liên hệ';

COMMENT ON COLUMN public.tb_contact_content.type
    IS 'Mục đích 0: Góp ý, 1: Báo lỗi, 2: Khác';