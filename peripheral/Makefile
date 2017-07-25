PROJECT_NAME     := air_pollution_monitor_peripheral
TARGETS          := peripheral
OUTPUT_DIRECTORY := build

NORDIC_SDK = ${NORDIC_HOME}
PROJ_DIR := .

$(OUTPUT_DIRECTORY)/peripheral.out: \
  LINKER_SCRIPT  := air_pollution_monitor_peripheral.ld

# Source files common to all targets
SRC_FILES += \
  $(PROJ_DIR)/main.c \
  $(PROJ_DIR)/air_monitor_service.c \
  $(NORDIC_SDK)/components/libraries/log/src/nrf_log_backend_serial.c \
  $(NORDIC_SDK)/components/libraries/log/src/nrf_log_frontend.c \
  $(NORDIC_SDK)/components/libraries/button/app_button.c \
  $(NORDIC_SDK)/components/libraries/util/app_error.c \
  $(NORDIC_SDK)/components/libraries/util/app_error_weak.c \
  $(NORDIC_SDK)/components/libraries/timer/app_timer.c \
  $(NORDIC_SDK)/components/libraries/util/app_util_platform.c \
  $(NORDIC_SDK)/components/libraries/crc16/crc16.c \
  $(NORDIC_SDK)/components/libraries/fds/fds.c \
  $(NORDIC_SDK)/components/libraries/fstorage/fstorage.c \
  $(NORDIC_SDK)/components/libraries/hardfault/hardfault_implementation.c \
  $(NORDIC_SDK)/components/libraries/util/nrf_assert.c \
  $(NORDIC_SDK)/components/libraries/util/sdk_errors.c \
  $(NORDIC_SDK)/components/libraries/util/sdk_mapped_flags.c \
  $(NORDIC_SDK)/components/libraries/sensorsim/sensorsim.c \
  $(NORDIC_SDK)/components/boards/boards.c \
  $(NORDIC_SDK)/components/drivers_nrf/clock/nrf_drv_clock.c \
  $(NORDIC_SDK)/components/drivers_nrf/common/nrf_drv_common.c \
  $(NORDIC_SDK)/components/drivers_nrf/gpiote/nrf_drv_gpiote.c \
  $(NORDIC_SDK)/components/drivers_nrf/uart/nrf_drv_uart.c \
  $(NORDIC_SDK)/components/libraries/bsp/bsp.c \
  $(NORDIC_SDK)/components/libraries/bsp/bsp_btn_ble.c \
  $(NORDIC_SDK)/components/libraries/bsp/bsp_nfc.c \
  $(NORDIC_SDK)/external/segger_rtt/RTT_Syscalls_GCC.c \
  $(NORDIC_SDK)/external/segger_rtt/SEGGER_RTT.c \
  $(NORDIC_SDK)/external/segger_rtt/SEGGER_RTT_printf.c \
  $(NORDIC_SDK)/components/ble/common/ble_advdata.c \
  $(NORDIC_SDK)/components/ble/ble_advertising/ble_advertising.c \
  $(NORDIC_SDK)/components/ble/common/ble_conn_params.c \
  $(NORDIC_SDK)/components/ble/common/ble_conn_state.c \
  $(NORDIC_SDK)/components/ble/common/ble_srv_common.c \
  $(NORDIC_SDK)/components/ble/peer_manager/gatt_cache_manager.c \
  $(NORDIC_SDK)/components/ble/peer_manager/gatts_cache_manager.c \
  $(NORDIC_SDK)/components/ble/peer_manager/id_manager.c \
  $(NORDIC_SDK)/components/ble/nrf_ble_gatt/nrf_ble_gatt.c \
  $(NORDIC_SDK)/components/ble/peer_manager/peer_data.c \
  $(NORDIC_SDK)/components/ble/peer_manager/peer_data_storage.c \
  $(NORDIC_SDK)/components/ble/peer_manager/peer_database.c \
  $(NORDIC_SDK)/components/ble/peer_manager/peer_id.c \
  $(NORDIC_SDK)/components/ble/peer_manager/peer_manager.c \
  $(NORDIC_SDK)/components/ble/peer_manager/pm_buffer.c \
  $(NORDIC_SDK)/components/ble/peer_manager/pm_mutex.c \
  $(NORDIC_SDK)/components/ble/peer_manager/security_dispatcher.c \
  $(NORDIC_SDK)/components/ble/peer_manager/security_manager.c \
  $(NORDIC_SDK)/components/toolchain/gcc/gcc_startup_nrf51.S \
  $(NORDIC_SDK)/components/toolchain/system_nrf51.c \
  $(NORDIC_SDK)/components/ble/ble_services/ble_bas/ble_bas.c \
  $(NORDIC_SDK)/components/ble/ble_services/ble_dis/ble_dis.c \
  $(NORDIC_SDK)/components/ble/ble_services/ble_hrs/ble_hrs.c \
  $(NORDIC_SDK)/components/softdevice/common/softdevice_handler/softdevice_handler.c \

# Include folders common to all targets
INC_FOLDERS += \
  $(PROJ_DIR)/include \
  $(NORDIC_SDK)/components/drivers_nrf/comp \
  $(NORDIC_SDK)/components/drivers_nrf/twi_master \
  $(NORDIC_SDK)/components/ble/ble_services/ble_ancs_c \
  $(NORDIC_SDK)/components/ble/ble_services/ble_ias_c \
  $(NORDIC_SDK)/components/softdevice/s130/headers \
  $(NORDIC_SDK)/components/libraries/pwm \
  $(NORDIC_SDK)/components/libraries/usbd/class/cdc/acm \
  $(NORDIC_SDK)/components/libraries/usbd/class/hid/generic \
  $(NORDIC_SDK)/components/libraries/usbd/class/msc \
  $(NORDIC_SDK)/components/libraries/usbd/class/hid \
  $(NORDIC_SDK)/components/libraries/log \
  $(NORDIC_SDK)/components/ble/ble_services/ble_gls \
  $(NORDIC_SDK)/components/libraries/fstorage \
  $(NORDIC_SDK)/components/drivers_nrf/i2s \
  $(NORDIC_SDK)/components/libraries/gpiote \
  $(NORDIC_SDK)/components/drivers_nrf/gpiote \
  $(NORDIC_SDK)/components/boards \
  $(NORDIC_SDK)/components/drivers_nrf/common \
  $(NORDIC_SDK)/components/ble/ble_advertising \
  $(NORDIC_SDK)/components/drivers_nrf/adc \
  $(NORDIC_SDK)/components/softdevice/s130/headers/nrf51 \
  $(NORDIC_SDK)/components/ble/ble_services/ble_bas_c \
  $(NORDIC_SDK)/components/ble/ble_services/ble_hrs_c \
  $(NORDIC_SDK)/components/libraries/queue \
  $(NORDIC_SDK)/components/ble/ble_dtm \
  $(NORDIC_SDK)/components/toolchain/cmsis/include \
  $(NORDIC_SDK)/components/ble/ble_services/ble_rscs_c \
  $(NORDIC_SDK)/components/drivers_nrf/uart \
  $(NORDIC_SDK)/components/ble/common \
  $(NORDIC_SDK)/components/ble/ble_services/ble_lls \
  $(NORDIC_SDK)/components/drivers_nrf/wdt \
  $(NORDIC_SDK)/components/libraries/bsp \
  $(NORDIC_SDK)/components/ble/ble_services/ble_bas \
  $(NORDIC_SDK)/components/libraries/experimental_section_vars \
  $(NORDIC_SDK)/components/ble/ble_services/ble_ans_c \
  $(NORDIC_SDK)/components/libraries/slip \
  $(NORDIC_SDK)/components/libraries/mem_manager \
  $(NORDIC_SDK)/external/segger_rtt \
  $(NORDIC_SDK)/components/libraries/usbd/class/cdc \
  $(NORDIC_SDK)/components/drivers_nrf/hal \
  $(NORDIC_SDK)/components/ble/ble_services/ble_nus_c \
  $(NORDIC_SDK)/components/drivers_nrf/rtc \
  $(NORDIC_SDK)/components/ble/ble_services/ble_ias \
  $(NORDIC_SDK)/components/libraries/usbd/class/hid/mouse \
  $(NORDIC_SDK)/components/drivers_nrf/ppi \
  $(NORDIC_SDK)/components/ble/ble_services/ble_dfu \
  $(NORDIC_SDK)/components/drivers_nrf/twis_slave \
  $(NORDIC_SDK)/components \
  $(NORDIC_SDK)/components/libraries/scheduler \
  $(NORDIC_SDK)/components/ble/ble_services/ble_lbs \
  $(NORDIC_SDK)/components/ble/ble_services/ble_hts \
  $(NORDIC_SDK)/components/drivers_nrf/delay \
  $(NORDIC_SDK)/components/libraries/crc16 \
  $(NORDIC_SDK)/components/drivers_nrf/timer \
  $(NORDIC_SDK)/components/libraries/util \
  $(NORDIC_SDK)/components/drivers_nrf/pwm \
  $(NORDIC_SDK)/components/libraries/csense_drv \
  $(NORDIC_SDK)/components/libraries/csense \
  $(NORDIC_SDK)/components/drivers_nrf/rng \
  $(NORDIC_SDK)/components/libraries/low_power_pwm \
  $(NORDIC_SDK)/components/libraries/hardfault \
  $(NORDIC_SDK)/components/ble/ble_services/ble_cscs \
  $(NORDIC_SDK)/components/libraries/uart \
  $(NORDIC_SDK)/components/libraries/hci \
  $(NORDIC_SDK)/components/libraries/usbd/class/hid/kbd \
  $(NORDIC_SDK)/components/drivers_nrf/spi_slave \
  $(NORDIC_SDK)/components/drivers_nrf/lpcomp \
  $(NORDIC_SDK)/components/libraries/timer \
  $(NORDIC_SDK)/components/drivers_nrf/power \
  $(NORDIC_SDK)/components/libraries/usbd/config \
  $(NORDIC_SDK)/components/toolchain \
  $(NORDIC_SDK)/components/libraries/led_softblink \
  $(NORDIC_SDK)/components/drivers_nrf/qdec \
  $(NORDIC_SDK)/components/ble/ble_services/ble_cts_c \
  $(NORDIC_SDK)/components/drivers_nrf/spi_master \
  $(NORDIC_SDK)/components/ble/ble_services/ble_nus \
  $(NORDIC_SDK)/components/ble/ble_services/ble_hids \
  $(NORDIC_SDK)/components/drivers_nrf/pdm \
  $(NORDIC_SDK)/components/libraries/crc32 \
  $(NORDIC_SDK)/components/libraries/usbd/class/audio \
  $(NORDIC_SDK)/components/libraries/sensorsim \
  $(NORDIC_SDK)/components/ble/peer_manager \
  $(NORDIC_SDK)/components/drivers_nrf/swi \
  $(NORDIC_SDK)/components/ble/ble_services/ble_tps \
  $(NORDIC_SDK)/components/ble/ble_services/ble_dis \
  $(NORDIC_SDK)/components/device \
  $(NORDIC_SDK)/components/ble/nrf_ble_gatt \
  $(NORDIC_SDK)/components/ble/nrf_ble_qwr \
  $(NORDIC_SDK)/components/libraries/button \
  $(NORDIC_SDK)/components/libraries/usbd \
  $(NORDIC_SDK)/components/drivers_nrf/saadc \
  $(NORDIC_SDK)/components/ble/ble_services/ble_lbs_c \
  $(NORDIC_SDK)/components/ble/ble_racp \
  $(NORDIC_SDK)/components/toolchain/gcc \
  $(NORDIC_SDK)/components/libraries/fds \
  $(NORDIC_SDK)/components/libraries/twi \
  $(NORDIC_SDK)/components/drivers_nrf/clock \
  $(NORDIC_SDK)/components/ble/ble_services/ble_rscs \
  $(NORDIC_SDK)/components/drivers_nrf/usbd \
  $(NORDIC_SDK)/components/softdevice/common/softdevice_handler \
  $(NORDIC_SDK)/components/ble/ble_services/ble_hrs \
  $(NORDIC_SDK)/components/libraries/log/src \

# Libraries common to all targets
LIB_FILES += \

# C flags common to all targets
CFLAGS += -DBOARD_CUSTOM
CFLAGS += -DSOFTDEVICE_PRESENT
CFLAGS += -DSWI_DISABLE0
CFLAGS += -D__HEAP_SIZE=0
CFLAGS += -DNRF51
CFLAGS += -DS130
CFLAGS += -DBLE_STACK_SUPPORT_REQD
CFLAGS += -DNRF51422
CFLAGS += -DNRF_SD_BLE_API_VERSION=2
CFLAGS += -mcpu=cortex-m0
CFLAGS += -mthumb -mabi=aapcs
CFLAGS +=  -Wall -Werror -O3 -g3
CFLAGS += -mfloat-abi=soft
# keep every function in separate section, this allows linker to discard unused ones
CFLAGS += -ffunction-sections -fdata-sections -fno-strict-aliasing
CFLAGS += -fno-builtin --short-enums

# C++ flags common to all targets
CXXFLAGS += \

# Assembler flags common to all targets
ASMFLAGS += -x assembler-with-cpp
ASMFLAGS += -DBOARD_CUSTOM
ASMFLAGS += -DSOFTDEVICE_PRESENT
ASMFLAGS += -DSWI_DISABLE0
ASMFLAGS += -D__HEAP_SIZE=0
ASMFLAGS += -DNRF51
ASMFLAGS += -DS130
ASMFLAGS += -DBLE_STACK_SUPPORT_REQD
ASMFLAGS += -DNRF51422
ASMFLAGS += -DNRF_SD_BLE_API_VERSION=2

# Linker flags
LDFLAGS += -mthumb -mabi=aapcs -L $(TEMPLATE_PATH) -T$(LINKER_SCRIPT)
LDFLAGS += -mcpu=cortex-m0
# let linker to dump unused sections
LDFLAGS += -Wl,--gc-sections
# use newlib in nano version
LDFLAGS += --specs=nano.specs -lc -lnosys


.PHONY: $(TARGETS) default all clean help flash flash_softdevice

# Default target - first one defined
default: peripheral merge

merge: peripheral
	mkdir -p build/merged
	mergehex --merge \
	$(OUTPUT_DIRECTORY)/peripheral.hex \
	$(NORDIC_SDK)/components/softdevice/s130/hex/s130_nrf51_2.0.1_softdevice.hex \
	--output build/merged/peripheral.hex

# Print all targets that can be built
help:
	@echo following targets are available:
	@echo 	peripheral

TEMPLATE_PATH := $(NORDIC_SDK)/components/toolchain/gcc

include $(TEMPLATE_PATH)/Makefile.common

$(foreach target, $(TARGETS), $(call define_target, $(target)))

# Flash the program
flash: $(OUTPUT_DIRECTORY)/peripheral.hex
	@echo Flashing: $<
	nrfjprog --program $< -f nrf51 --sectorerase
	nrfjprog --reset -f nrf51

# Flash softdevice
flash_softdevice:
	@echo Flashing: s130_nrf51_2.0.1_softdevice.hex
	nrfjprog --program $(NORDIC_SDK)/components/softdevice/s130/hex/s130_nrf51_2.0.1_softdevice.hex -f nrf51 --sectorerase
	nrfjprog --reset -f nrf51

erase:
	nrfjprog --eraseall -f nrf52
