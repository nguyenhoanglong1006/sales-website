-- Table: public.tb_order_detail

-- DROP TABLE IF EXISTS public.tb_order_detail;

CREATE TABLE IF NOT EXISTS public.tb_order_detail
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    amount integer NOT NULL,
    price double precision NOT NULL,
    attribute text COLLATE pg_catalog."default" NOT NULL,
    total double precision NOT NULL,
    note text COLLATE pg_catalog."default",
    status smallint,
    maker_id integer,
    maker_date time without time zone,
    CONSTRAINT tb_order_detail_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;


ALTER TABLE IF EXISTS public.tb_order_detail
    OWNER to postgres;

COMMENT ON TABLE public.tb_order_detail
    IS 'chi tiết đơn hàng';

COMMENT ON COLUMN public.tb_order_detail.id
    IS 'Số sequence';

COMMENT ON COLUMN public.tb_order_detail.order_id
    IS 'ID đơn hàng';

COMMENT ON COLUMN public.tb_order_detail.product_id
    IS 'ID sản phẩm';

COMMENT ON COLUMN public.tb_order_detail.amount
    IS 'Số lượng';

COMMENT ON COLUMN public.tb_order_detail.price
    IS 'Giá sản phẩm';

COMMENT ON COLUMN public.tb_order_detail.attribute
    IS 'Thuộc tính sản phẩm';

COMMENT ON COLUMN public.tb_order_detail.total
    IS 'Thành tiền';
