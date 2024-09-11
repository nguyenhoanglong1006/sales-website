-- Table: public.tb_contact
-- DROP TABLE IF EXISTS public.tb_contact;
CREATE TABLE IF NOT EXISTS public.tb_contact (
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY (
        INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1
    ),
    name character varying(255) COLLATE pg_catalog."default",
    phone character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    subject character varying(255) COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    checked integer DEFAULT 0,
    contact_content_id integer,
    message_send character varying(500) COLLATE pg_catalog."default",
    subject_send character varying(500) COLLATE pg_catalog."default",
    day_send timestamp without time zone,
    level integer,
    note text COLLATE pg_catalog."default",
    status integer DEFAULT 0,
    maker_id bigint NOT NULL,
    maker_date timestamp without time zone,
    CONSTRAINT tb_contact_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE
    IF EXISTS public.tb_contact OWNER to postgres;

COMMENT ON COLUMN public.tb_contact.id IS 'Số sequence';

COMMENT ON COLUMN public.tb_contact.name IS 'Tên người gửi';

COMMENT ON COLUMN public.tb_contact.phone IS 'Số điện thoại';

COMMENT ON COLUMN public.tb_contact.email IS 'Email';

COMMENT ON COLUMN public.tb_contact.subject IS 'Tiêu đề';

COMMENT ON COLUMN public.tb_contact.message IS 'Nội dung';

COMMENT ON COLUMN public.tb_contact.checked IS 'Tình trạng liên hệ: 0: Chưa xem, 1: Đã xem';

COMMENT ON COLUMN public.tb_contact.status IS 'Tình trạng dữ liệu: 1: Active, 0: Inactive';

COMMENT ON COLUMN public.tb_contact.maker_id IS 'Người tạo';

COMMENT ON COLUMN public.tb_contact.maker_date IS 'Ngày tạo';